import { FACET_CROSS_SELLING_MAP } from './../utils/facets'
import { BadRequestError, NotFoundError } from '../../errors'
import { mutateChannelContext, mutateLocaleContext } from '../utils/contex'
import { enhanceSku } from '../utils/enhanceSku'
import {
  findChannel,
  findCrossSelling,
  findLocale,
  findSkuId,
  findSlug,
  transformSelectedFacet,
} from '../utils/facets'
import { SORT_MAP } from '../utils/sort'
import { StoreCollection } from './collection'
import type {
  QueryAllCollectionsArgs,
  QueryAllProductsArgs,
  QueryCollectionArgs,
  QueryProductArgs,
  QuerySearchArgs,
  QuerySellersArgs,
  QueryShippingArgs,
  QueryRedirectArgs,
} from '../../../__generated__/schema'
import type { CategoryTree } from '../clients/commerce/types/CategoryTree'
import type { Context } from '../index'
import { isValidSkuId, pickBestSku } from '../utils/sku'
import { SearchArgs } from '../clients/search'

export const Query = {
  product: async (_: unknown, { locator }: QueryProductArgs, ctx: Context) => {
    // Insert channel in context for later usage
    const channel = findChannel(locator)
    const locale = findLocale(locator)
    const id = findSkuId(locator)
    const slug = findSlug(locator)

    if (channel) {
      mutateChannelContext(ctx, channel)
    }

    if (locale) {
      mutateLocaleContext(ctx, locale)
    }

    const {
      loaders: { skuLoader },
      clients: { commerce, search },
    } = ctx

    try {
      const skuId = id ?? slug?.split('-').pop() ?? ''

      if (!isValidSkuId(skuId)) {
        throw new Error('Invalid SkuId')
      }

      const sku = await skuLoader.load(skuId)

      /**
       * Here be dragons 🦄🦄🦄
       *
       * In some cases, the slug has a valid skuId for a different
       * product. This condition makes sure that the fetched sku
       * is the one we actually asked for
       * */
      if (
        slug &&
        sku.isVariantOf.linkText &&
        !slug.startsWith(sku.isVariantOf.linkText)
      ) {
        throw new Error(
          `Slug was set but the fetched sku does not satisfy the slug condition. slug: ${slug}, linkText: ${sku.isVariantOf.linkText}`
        )
      }

      return sku
    } catch (err) {
      if (slug == null) {
        throw new BadRequestError('Missing slug or id')
      }

      const route = await commerce.catalog.portal.pagetype(`${slug}/p`)

      if (route.pageType !== 'Product' || !route.id) {
        throw new NotFoundError(`No product found for slug ${slug}`)
      }

      const {
        products: [product],
      } = await search.products({
        page: 0,
        count: 1,
        query: `product:${route.id}`,
      })

      if (!product) {
        throw new NotFoundError(`No product found for id ${route.id}`)
      }

      const sku = pickBestSku(product.items)

      return enhanceSku(sku, product)
    }
  },
  collection: (_: unknown, { slug }: QueryCollectionArgs, ctx: Context) => {
    const {
      loaders: { collectionLoader },
    } = ctx

    return collectionLoader.load(slug)
  },
  search: async (
    _: unknown,
    { first, after: maybeAfter, sort, term, selectedFacets }: QuerySearchArgs,
    ctx: Context
  ) => {
    // Insert channel in context for later usage
    const channel = findChannel(selectedFacets)
    const locale = findLocale(selectedFacets)
    const crossSelling = findCrossSelling(selectedFacets)

    if (channel) {
      mutateChannelContext(ctx, channel)
    }

    if (locale) {
      mutateLocaleContext(ctx, locale)
    }

    let query = term

    /**
     * In case we are using crossSelling, we need to modify the search
     * we will be performing on our search engine. The idea in here
     * is to use the cross selling API for fetching the productIds our
     * search will return for us.
     * Doing this two request workflow makes it possible to have cross
     * selling with Search features, like pagination, internationalization
     * etc
     */
    if (crossSelling) {
      const products = await ctx.clients.commerce.catalog.products.crossselling(
        {
          type: FACET_CROSS_SELLING_MAP[crossSelling.key],
          productId: crossSelling.value,
        }
      )

      query = `product:${products
        .map((x) => x.productId)
        .slice(0, first)
        .join(';')}`
    }

    const after = maybeAfter ? Number(maybeAfter) : 0
    const searchArgs: Omit<SearchArgs, 'type'> = {
      page: Math.ceil(after / first),
      count: first,
      query: query ?? undefined,
      sort: SORT_MAP[sort ?? 'score_desc'],
      selectedFacets: selectedFacets?.flatMap(transformSelectedFacet) ?? [],
    }

    const productSearchPromise = ctx.clients.search.products(searchArgs)

    return { searchArgs, productSearchPromise }
  },
  allProducts: async (
    _: unknown,
    { first, after: maybeAfter }: QueryAllProductsArgs,
    ctx: Context
  ) => {
    const {
      clients: { search },
    } = ctx

    const after = maybeAfter ? Number(maybeAfter) : 0
    const products = await search.products({
      page: Math.ceil(after / first),
      count: first,
    })

    const skus = products.products
      .map((product) => product.items.map((sku) => enhanceSku(sku, product)))
      .flat()
      .filter((sku) => sku.sellers.length > 0)

    return {
      pageInfo: {
        hasNextPage: products.pagination.after.length > 0,
        hasPreviousPage: products.pagination.before.length > 0,
        startCursor: '0',
        endCursor: products.recordsFiltered.toString(),
        totalCount: products.recordsFiltered,
      },
      // after + index is bigger than after+first itself because of the array flat() above
      edges: skus.map((sku, index) => ({
        node: sku,
        cursor: (after + index).toString(),
      })),
    }
  },
  allCollections: async (
    _: unknown,
    { first, after: maybeAfter }: QueryAllCollectionsArgs,
    ctx: Context
  ) => {
    const {
      clients: { commerce },
    } = ctx

    const after = maybeAfter ? Number(maybeAfter) : 0

    const [brands, tree] = await Promise.all([
      commerce.catalog.brand.list(),
      commerce.catalog.category.tree(),
    ])

    const categories: Array<CategoryTree & { level: number }> = []
    const dfs = (node: CategoryTree, level: number) => {
      categories.push({ ...node, level })

      for (const child of node.children) {
        dfs(child, level + 1)
      }
    }

    for (const node of tree) {
      dfs(node, 0)
    }

    const collections = [
      ...brands
        .filter((brand) => brand.isActive)
        .map((x) => ({ ...x, type: 'brand' })),
      ...categories,
    ]

    const validCollections = collections
      // Nullable slugs may cause one route to override the other
      .filter((node) => Boolean(StoreCollection.slug(node, null, ctx, null)))

    return {
      pageInfo: {
        hasNextPage: validCollections.length - after > first,
        hasPreviousPage: after > 0,
        startCursor: '0',
        endCursor: (
          Math.min(first, validCollections.length - after) - 1
        ).toString(),
        totalCount: validCollections.length,
      },
      edges: validCollections
        .slice(after, after + first)
        .map((node, index) => ({
          node,
          cursor: (after + index).toString(),
        })),
    }
  },
  shipping: async (
    _: unknown,
    { country, items, postalCode }: QueryShippingArgs,
    ctx: Context
  ) => {
    const {
      loaders: { simulationLoader },
      clients: { commerce },
    } = ctx

    const [simulation, address] = await Promise.all([
      simulationLoader.load({ country, items, postalCode }),
      commerce.checkout.address({ postalCode, country }),
    ])

    return {
      ...simulation,
      address,
    }
  },

  redirect: async (
    _: unknown,
    { term, selectedFacets }: QueryRedirectArgs,
    ctx: Context
  ) => {
    // Currently the search redirection can be done through a search term or filter (facet) so we limit the redirect query to always have one of these values otherwise we do not execute it.
    // https://help.vtex.com/en/tracks/vtex-intelligent-search--19wrbB7nEQcmwzDPl1l4Cb/4Gd2wLQFbCwTsh8RUDwSoL?&utm_source=autocomplete
    if (!term && (!selectedFacets || !selectedFacets.length)) {
      return null
    }

    const { redirect } = await ctx.clients.search.products({
      page: 1,
      count: 1,
      query: term ?? undefined,
      selectedFacets: selectedFacets?.flatMap(transformSelectedFacet) ?? [],
    })

    return {
      url: redirect,
    }
  },

  sellers: async (
    _: unknown,
    { postalCode, geoCoordinates, country, salesChannel }: QuerySellersArgs,
    ctx: Context
  ) => {
    const {
      clients: { commerce },
    } = ctx

    const regionData = await commerce.checkout.region({
      postalCode,
      geoCoordinates,
      country,
      salesChannel,
    })
    const region = regionData?.[0]
    const { id, sellers } = region

    return {
      id,
      sellers,
    }
  },
}
