import type {
  ProcessOrderAuthorizationRule,
  QueryAllCollectionsArgs,
  QueryAllProductsArgs,
  QueryCollectionArgs,
  QueryListUserOrdersArgs,
  QueryPickupPointsArgs,
  QueryProductArgs,
  QueryProductCountArgs,
  QueryProductsArgs,
  QueryProfileArgs,
  QueryRedirectArgs,
  QuerySearchArgs,
  QuerySellersArgs,
  QueryShippingArgs,
  QueryUserOrderArgs,
  UserOrderFromList,
} from '../../../__generated__/schema'
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  isForbiddenError,
  isNotFoundError,
} from '../../errors'
import type { CategoryTree } from '../clients/commerce/types/CategoryTree'
import type { ProfileAddress } from '../clients/commerce/types/Profile'
import type { SearchArgs } from '../clients/search'
import type { ProductSearchResult } from '../clients/search/types/ProductSearchResult'
import type { GraphqlContext } from '../index'
import type {
  ByLinkIdBrandRoot,
  ByLinkIdCategoryRoot,
} from '../loaders/collection'
import { extractRuleForAuthorization } from '../utils/commercialAuth'
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
import {
  getCatalogLocale,
  isConfiguredLocale,
  isLocalizationEnabled,
} from '../utils/localization'
import { isValidSkuId, pickBestSku } from '../utils/sku'
import { slugify } from '../utils/slugify'
import { SORT_MAP } from '../utils/sort'
import { FACET_CROSS_SELLING_MAP } from './../utils/facets'
import { StoreCollection } from './collection'
import { getOrderEntryOperation } from './getOrderEntryOperation'
import { getOrderFormItems } from './getOrderFormItems'
import { getLocalizedProductEntry } from './product'

/**
 * Validates that a slug mismatch between IS linkText and the requested slug is
 * actually a localized slug match. Fetches the localized product entry from
 * Catalog Dataplane (with request-scoped caching) and checks whether the slug
 * prefix matches the localized linkId for the current locale.
 *
 * Returns true if the slug is a valid localized match, false otherwise
 * (including when the Dataplane API is unavailable).
 */
async function isLocalizedSlugMatch(
  ctx: GraphqlContext,
  slug: string,
  productGroupID: string,
  locale: string
): Promise<boolean> {
  const slugPrefix = slug.slice(0, slug.lastIndexOf('-'))
  const entry = await getLocalizedProductEntry(ctx, productGroupID, locale)

  return entry?.linkId === slugPrefix
}

const INVALID_SKU_ID_ERROR = 'Invalid SkuId'
const SLUG_MISMATCH_ERROR =
  'Slug was set but the fetched sku does not satisfy the slug condition.'

const shouldFallbackToProductRoute = (error: unknown) =>
  isNotFoundError(error) ||
  (error instanceof Error &&
    (error.message === INVALID_SKU_ID_ERROR ||
      error.message.startsWith(SLUG_MISMATCH_ERROR)))

export const Query = {
  product: async (
    _: unknown,
    { locator }: QueryProductArgs,
    ctx: GraphqlContext
  ) => {
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
        throw new Error(INVALID_SKU_ID_ERROR)
      }

      const sku = await skuLoader.load(skuId)

      /**
       * Here be dragons 🦄🦄🦄
       *
       * In some cases, the slug has a valid skuId for a different
       * product. This condition makes sure that the fetched sku
       * is the one we actually asked for.
       *
       * When localization is enabled, the slug prefix may be a localized
       * LinkId that differs from the IS linkText (always in the default locale).
       * In that case we validate against the Catalog Dataplane API before
       * rejecting the slug.
       * */
      if (
        slug &&
        sku.isVariantOf.linkText &&
        !slug.startsWith(sku.isVariantOf.linkText)
      ) {
        if (
          isLocalizationEnabled(ctx) &&
          locale &&
          isValidSkuId(slug.split('-').pop() ?? '') &&
          (await isLocalizedSlugMatch(
            ctx,
            slug,
            sku.isVariantOf.productId,
            locale
          ))
        ) {
          return sku
        }

        throw new Error(
          `Slug was set but the fetched sku does not satisfy the slug condition. slug: ${slug}, linkText: ${sku.isVariantOf.linkText}`
        )
      }

      return sku
    } catch (err) {
      if (!shouldFallbackToProductRoute(err)) {
        throw err
      }

      if (slug == null) {
        throw new BadRequestError('Missing slug or id')
      }

      const route = await commerce.catalog.portal.pagetype(`${slug}/p`)

      if (route.pageType !== 'Product' || !route.id) {
        throw new NotFoundError(`No product found for slug ${slug}`)
      }

      const product = await search
        .fetchProduct({
          field: 'id',
          value: String(route.id),
        })
        .catch(() => null)

      if (!product) {
        throw new NotFoundError(`No product found for id ${route.id}`)
      }

      const sku = pickBestSku(product.items)

      return enhanceSku(sku, product)
    }
  },
  collection: (
    _: unknown,
    { slug, locale }: QueryCollectionArgs,
    ctx: GraphqlContext
  ) => {
    // Validate client-supplied locale against the configured locales before
    // propagating it to downstream platform APIs (Search, Catalog, OrderForm).
    // Unknown values are ignored so the request falls back to the store default
    // instead of forwarding arbitrary input.
    if (locale && isConfiguredLocale(ctx, locale)) {
      mutateLocaleContext(ctx, locale)
    }

    const {
      loaders: { collectionLoader },
    } = ctx

    // Pass locale on the load key (captured now) so Accept-Language and the
    // DataLoader cache entry cannot race on a later mutateLocaleContext from
    // a sibling aliased collection field in the same request.
    return collectionLoader.load({
      slug,
      locale: getCatalogLocale(ctx),
    })
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
    ctx: GraphqlContext
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

    const after = maybeAfter ? Number(maybeAfter) : 0
    const searchArgs: Omit<SearchArgs, 'type'> = {
      page: Math.ceil(after / first) || 0,
      count: first,
      query: term ?? undefined,
      sort: SORT_MAP[sort ?? 'score_desc'] ?? SORT_MAP.score_desc,
      selectedFacets: selectedFacets?.flatMap(transformSelectedFacet) ?? [],
      sponsoredCount: sponsoredCount ?? undefined,
    }

    /**
     * In case we are using crossSelling, we fetch product IDs from the
     * cross selling API and then hydrate them using the PDP endpoint
     * via productsByIdentifier.
     */
    if (crossSelling) {
      const crossSellingProducts =
        await ctx.clients.commerce.catalog.products.crossselling({
          type: FACET_CROSS_SELLING_MAP[crossSelling.key],
          productId: crossSelling.value,
        })

      const productIds = crossSellingProducts
        .map((x) => x.productId)
        .slice(0, first)

      const productSearchPromise: Promise<ProductSearchResult> =
        ctx.clients.search
          .productsByIdentifier({ field: 'id', values: productIds })
          .then((products) => ({
            products,
            recordsFiltered: products.length,
            pagination: {
              count: products.length,
              current: { index: 0, proxyURL: '' },
              before: [],
              after: [],
              perPage: first,
              next: { index: 0, proxyURL: '' },
              previous: { index: 0, proxyURL: '' },
              first: { index: 0, proxyURL: '' },
              last: { index: 0, proxyURL: '' },
            },
            sampling: false,
            options: { sorts: [], counts: [] },
            translated: false,
            locale: '',
            query: '',
            operator: 'and',
            fuzzy: '0',
            searchId: '',
          }))

      return { searchArgs, productSearchPromise }
    }

    const productSearchPromise = ctx.clients.search.products(searchArgs)

    return { searchArgs, productSearchPromise }
  },
  allProducts: async (
    _: unknown,
    { first, after: maybeAfter }: QueryAllProductsArgs,
    ctx: GraphqlContext
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
    ctx: GraphqlContext
  ) => {
    const {
      clients: { search },
    } = ctx

    if (!productIds.length) {
      return []
    }

    const products = await search.productsByIdentifier({
      field: 'id',
      values: productIds,
    })

    return products
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
    ctx: GraphqlContext
  ) => {
    const {
      clients: { commerce },
    } = ctx

    const after = maybeAfter ? Number(maybeAfter) : 0

    const [brands, tree] = await Promise.all([
      commerce.catalog.brand.list(),
      commerce.catalog.category.tree(),
    ])

    // Flatten the category tree. parentId is tracked per node so
    // the type resolver can correctly classify Departments (fatherCategoryId: null)
    // vs Categories (fatherCategoryId: number).
    const categoryRoots: ByLinkIdCategoryRoot[] = []
    const dfs = (node: CategoryTree, parentId: number | null) => {
      categoryRoots.push({
        id: node.id,
        name: node.name,
        fatherCategoryId: parentId,
        linkId: slugify(node.name),
        title: node.Title,
        description: null,
        metaTagDescription: node.MetaTagDescription,
        availableLinkIds: null,
        entityType: 'category' as const,
        slug: new URL(node.url).pathname.slice(1).toLowerCase(),
      })

      for (const child of node.children) {
        dfs(child, node.id)
      }
    }

    for (const node of tree) {
      dfs(node, null)
    }

    const brandRoots: ByLinkIdBrandRoot[] = brands
      .filter((brand) => brand.isActive)
      .map((brand) => ({
        id: brand.id,
        name: brand.name,
        linkId: slugify(brand.name),
        title: brand.title,
        description: null,
        metaTagDescription: brand.metaTagDescription,
        availableLinkIds: null,
        entityType: 'brand' as const,
      }))

    const collections = [...brandRoots, ...categoryRoots]

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
    ctx: GraphqlContext
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
    ctx: GraphqlContext
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
    ctx: GraphqlContext
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
  profile: async (
    _: unknown,
    { id }: QueryProfileArgs,
    ctx: GraphqlContext
  ) => {
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
    ctx: GraphqlContext
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
    ctx: GraphqlContext
  ) => {
    try {
      if (!orderId) {
        throw new BadRequestError('Missing orderId')
      }

      const {
        clients: { commerce },
      } = ctx

      const order = await commerce.oms.userOrder({ orderId })

      if (!order) {
        throw new NotFoundError(`No order found for id ${orderId}`)
      }

      let ruleForAuthorization: ProcessOrderAuthorizationRule | null = null

      try {
        /**
         * This endpoint could return a 404 error if has not an authorization
         * for the order, so we catch the error and return null
         * instead of throwing an error.
         */
        const commercialAuth =
          await commerce.oms.getCommercialAuthorizationsByOrderId({ orderId })

        ruleForAuthorization = extractRuleForAuthorization(commercialAuth)
      } catch (err: any) {}

      const shopperSearch =
        (await commerce.masterData.getShopperById({
          userId: order.purchaseAgentData?.purchaseAgents?.[0]?.userId ?? '',
        })) ?? []
      const shopper = shopperSearch[0] ?? {}

      return {
        orderId: order.orderId,
        creationDate: order.creationDate,
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
        canProcessOrderAuthorization:
          (order.status === 'waiting-for-confirmation' ||
            order.status === 'waiting-for-authorization') &&
          !!ruleForAuthorization,
        ruleForAuthorization,
        shopper: {
          firstName: shopper?.firstName || '',
          lastName: shopper?.lastName || '',
          email: shopper?.email || '',
          phone: shopper?.phone || '',
        },
        budgetData: order.budgetData ?? { budgets: [] },
      }
    } catch (error) {
      const errorMessage = (error as Error).message

      let result: {
        code?: string
        message?: string
        exception?: any
      } = {}

      /** The errorMessage can be in:
       * JSON format: {"error":{"code":"OMS007","message":"Order Not Found","exception":null}}
       * Plain text format: "No authorized"
       * Unknown format
       */
      try {
        const parsed = JSON.parse(errorMessage)
        result = parsed.error || parsed
      } catch {
        result = { message: errorMessage }
      }

      const message = result?.message || errorMessage

      if (isNotFoundError(error)) {
        throw new NotFoundError(`No order found for id ${orderId}. ${message}.`)
      }

      if (isForbiddenError(error)) {
        throw new ForbiddenError(
          `You are forbidden to interact with order with id ${orderId}. ${message}.`
        )
      }

      // Fallback for other Errors
      throw error
    }
  },
  listUserOrders: async (
    _: unknown,
    filters: QueryListUserOrdersArgs,
    ctx: GraphqlContext
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
  validateUser: async (_: unknown, __: unknown, _ctx: GraphqlContext) => {
    // Authentication is now handled by @auth directive
    // If we reach here, validation was successful, otherwise an error would have been thrown
    return {
      isValid: true,
    }
  },
  // only b2b users
  userDetails: async (_: unknown, __: unknown, ctx: GraphqlContext) => {
    const {
      account,
      headers,
      clients: { commerce },
    } = ctx

    const jwt = parseJwt(getAuthCookie(headers?.cookie ?? '', account))
    const userId = jwt?.userId ?? ''

    const [sessionData, shopperResult, lmRoles] = await Promise.all([
      commerce.session('').catch(() => null),
      userId
        ? commerce.masterData.getShopperById({ userId }).catch(() => null)
        : Promise.resolve(null),
      userId
        ? commerce.licenseManager.getUserRoles({ userId }).catch(() => null)
        : Promise.resolve(null),
    ])

    const shopper = shopperResult?.[0]
    const authentication = sessionData?.namespaces.authentication ?? null

    const fullName =
      `${(shopper?.firstName ?? '').trim()} ${(shopper?.lastName ?? '').trim()}`.trim()

    return {
      username: authentication?.storeUserEmail?.value ?? '',
      name: fullName,
      email: authentication?.storeUserEmail?.value ?? '',
      phone: shopper?.phone ?? '',
      role: lmRoles?.Roles?.map((r) => r.Name) ?? [],
      orgUnit: authentication?.unitName?.value ?? '',
    }
  },
  // If isRepresentative, return b2b information.
  // If not, return b2c user information
  accountProfile: async (_: unknown, __: unknown, ctx: GraphqlContext) => {
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
      const contract = await commerce.masterData.getContractById({
        contractId: profile?.id?.value ?? '',
      })

      const name =
        contract?.corporateName ??
        `${(profile?.firstName?.value ?? '').trim()} ${(profile?.lastName?.value ?? '').trim()}`.trim()

      return {
        name: name || '',
        email: profile?.email?.value || '',
        id: profile?.id?.value || '',
        // createdAt: '',
      }
    }

    const user = await commerce.licenseManager
      .getUserById({
        userId: jwt?.userId,
      })
      .catch(() => null)

    return {
      name: user?.name || '',
      email: user?.email || '',
      id: user?.id || '',
      // createdAt: '',
    }
  },
  pickupPoints: async (
    _: unknown,
    { geoCoordinates }: QueryPickupPointsArgs,
    ctx: GraphqlContext
  ) => {
    const {
      clients: { commerce },
    } = ctx

    const result = await commerce.checkout.pickupPoints({
      geoCoordinates,
    })

    return result
  },
  orderEntryOperation: getOrderEntryOperation,
  orderFormItems: getOrderFormItems,
}
