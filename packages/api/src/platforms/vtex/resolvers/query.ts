import type {
  QueryAllCollectionsArgs,
  QueryAllProductsArgs,
  QueryCollectionArgs,
  QueryListUserOrdersArgs,
  QueryProductArgs,
  QueryProductCountArgs,
  QueryProfileArgs,
  QueryRedirectArgs,
  QuerySearchArgs,
  QuerySellersArgs,
  QueryShippingArgs,
  QueryUserOrderArgs,
  UserOrderFromList,
  QueryProductsArgs,
} from '../../../__generated__/schema'
import { BadRequestError, ForbiddenError, NotFoundError } from '../../errors'
import type { CategoryTree } from '../clients/commerce/types/CategoryTree'
import type { ProfileAddress } from '../clients/commerce/types/Profile'
import type { SearchArgs } from '../clients/search'
import type { Context } from '../index'
import { mutateChannelContext, mutateLocaleContext } from '../utils/contex'
import { getAuthCookie, parseJwt } from '../utils/cookies'
import { enhanceSku } from '../utils/enhanceSku'
import {
  findChannel,
  findCrossSelling,
  findLocale,
  findSkuId,
  findSlug,
  transformSelectedFacet,
} from '../utils/facets'
import { isValidSkuId, pickBestSku } from '../utils/sku'
import { SORT_MAP } from '../utils/sort'
import { FACET_CROSS_SELLING_MAP } from './../utils/facets'
import { StoreCollection } from './collection'

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
        // Manually disabling this flag to prevent regionalization issues
        hideUnavailableItems: false,
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
    {
      first,
      after: maybeAfter,
      sort,
      term,
      selectedFacets,
      sponsoredCount,
    }: QuerySearchArgs,
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
      page: Math.ceil(after / first) || 0,
      count: first,
      query: query ?? undefined,
      sort: SORT_MAP[sort ?? 'score_desc'],
      selectedFacets: selectedFacets?.flatMap(transformSelectedFacet) ?? [],
      sponsoredCount: sponsoredCount ?? undefined,
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
      .flatMap((product) =>
        product.items.map((sku) => enhanceSku(sku, product))
      )
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
  products: async (
    _: unknown,
    { productIds }: QueryProductsArgs,
    ctx: Context
  ) => {
    const {
      clients: { search },
    } = ctx

    if (!productIds.length) {
      return []
    }

    const query = `id:${productIds.join(';')}`
    const products = await search.products({
      page: 0,
      count: productIds.length,
      query,
    })

    return products.products
      .flatMap((product) =>
        product.items.map((sku) => enhanceSku(sku, product))
      )
      .filter(
        (sku) => productIds.includes(sku.itemId) && sku.sellers.length > 0
      )
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
      allowRedirect: true,
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
  profile: async (_: unknown, { id }: QueryProfileArgs, ctx: Context) => {
    const {
      clients: { commerce },
    } = ctx

    const addresses = await commerce.profile.addresses(id)

    function mapAddressesToList(
      addressesObj: Record<string, string>
    ): ProfileAddress[] {
      if (!addressesObj || Object.keys(addressesObj).length === 0) {
        return []
      }

      return Object.values(addressesObj).map(
        (stringifiedObj) => JSON.parse(stringifiedObj) as ProfileAddress
      )
    }

    const parsedAddresses = mapAddressesToList(addresses)

    return { addresses: parsedAddresses }
  },
  productCount: async (
    _: unknown,
    { term }: QueryProductCountArgs,
    ctx: Context
  ) => {
    const {
      clients: { search },
    } = ctx

    const result = await search.productCount({
      query: term ?? undefined,
    })

    return result
  },
  userOrder: async (
    _: unknown,
    { orderId }: QueryUserOrderArgs,
    ctx: Context
  ) => {
    const {
      clients: { commerce },
    } = ctx
    if (!orderId) {
      throw new BadRequestError('Missing orderId')
    }

    try {
      const order = await commerce.oms.userOrder({ orderId })

      if (!order) {
        throw new NotFoundError(`No order found for id ${orderId}`)
      }

      return {
        orderId: order.orderId,
        totals: order.totals,
        items: order.items,
        shippingData: order.shippingData,
        paymentData: order.paymentData,
        customData: order.customData,
        status: order.status,
        statusDescription: order.statusDescription,
        allowCancellation: order.allowCancellation,
        storePreferencesData: order.storePreferencesData,
        clientProfileData: order.clientProfileData,
        canCancelOrder:
          order.status === 'payment-approved' ||
          order.status === 'approve-payment',
      }
    } catch (error) {
      const result = JSON.parse((error as Error).message).error as {
        code: string
        message: string
        exception: any
      }

      if (result?.message?.toLowerCase()?.includes('order not found')) {
        throw new NotFoundError(`No order found for id ${orderId}`)
      }

      if (result?.message?.toLowerCase()?.includes('acesso negado')) {
        throw new ForbiddenError(
          `You are forbidden to interact with order with id ${orderId}`
        )
      }

      throw error
    }
  },
  listUserOrders: async (
    _: unknown,
    filters: QueryListUserOrdersArgs,
    ctx: Context
  ) => {
    const {
      clients: { commerce },
    } = ctx

    const orders = await commerce.oms.listUserOrders(filters)
    return {
      list: orders.list?.map((order: UserOrderFromList) => ({
        orderId: order.orderId,
        creationDate: order.creationDate,
        clientName: order.clientName,
        items: order.items,
        totalValue: order.totalValue,
        status: order.status,
        statusDescription: order.statusDescription,
        ShippingEstimatedDate: order.ShippingEstimatedDate,
        customFields: order.customFields,
        currencyCode: order.currencyCode,
      })),
      paging: orders.paging,
    }
  },
  accountName: async (_: unknown, __: unknown, ctx: Context) => {
    const {
      account,
      headers,
      clients: { commerce },
    } = ctx

    const jwt = parseJwt(getAuthCookie(headers?.cookie ?? '', account))

    if (!jwt?.userId) {
      return null
    }

    if (jwt?.isRepresentative) {
      const sessionData = await commerce.session('').catch(() => null)

      if (!sessionData) {
        return null
      }

      const profile = sessionData.namespaces.profile ?? null

      return (
        `${(profile?.firstName?.value ?? '').trim()} ${(profile?.lastName?.value ?? '').trim()}`.trim() ||
        ''
      )
    }

    const user = await commerce.licenseManager
      .getUserById({
        userId: jwt?.userId,
      })
      .catch(() => null)

    return user?.name || ''
  },
  validateUser: async (_: unknown, __: unknown, ctx: Context) => {
    const {
      clients: { commerce },
    } = ctx

    // This resolver is used to validate if the user is logged in
    // and has access to the account area.
    // If the user is not logged in, it will throw an error.
    // If the user is logged in, it will return true.
    try {
      const response = await commerce.vtexid.validate()

      return {
        isValid: response.authStatus === 'Success',
      }
    } catch (error) {
      throw new ForbiddenError('You are not allowed to access this resource')
    }
  },
}
