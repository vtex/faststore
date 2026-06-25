import type {
  ProcessOrderAuthorizationRule,
  QueryAllCollectionsArgs,
  QueryAllProductsArgs,
  QueryAvailableContractsArgs,
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
  StoreContract,
  UserOrderFromList,
} from '../../../__generated__/schema'
import { getOrderEntryOperation } from './getOrderEntryOperation'
import { getOrderFormItems } from './getOrderFormItems'
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
import { extractRuleForAuthorization } from '../utils/commercialAuth'
import {
  isSwitchableStoreFrontContract,
  resolveActiveContractDisplayName,
  resolveContractDisplayNameFromStoreFront,
} from '../utils/contract'
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
    { slug }: QueryCollectionArgs,
    ctx: GraphqlContext
  ) => {
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

      const name = resolveActiveContractDisplayName(contract, profile)

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
  // only b2b users
  // Storefront contract list — buyer-portal BFF `contracts/attached?details=true`.
  availableContracts: async (
    _: unknown,
    { orgUnitId }: QueryAvailableContractsArgs,
    ctx: GraphqlContext
  ): Promise<StoreContract[]> => {
    if (!orgUnitId) {
      throw new BadRequestError('Missing orgUnitId')
    }

    const {
      account,
      headers,
      clients: { commerce },
    } = ctx

    const sessionData = await commerce.session('').catch(() => null)
    const authToken = getAuthCookie(headers?.cookie ?? '', account)
    let jwt: ReturnType<typeof parseJwt> = null

    try {
      jwt = authToken ? parseJwt(authToken) : null
    } catch {
      jwt = null
    }

    const sessionUnitId =
      sessionData?.namespaces.authentication?.unitId?.value?.trim() ??
      jwt?.unitId?.trim() ??
      ''

    if (!sessionUnitId || sessionUnitId !== orgUnitId) {
      throw new ForbiddenError(
        'You are not allowed to list contracts for this organization unit'
      )
    }

    const { contracts = [] } =
      await commerce.storeFront.getAttachedContractsByOrgUnit({ orgUnitId })

    if (contracts.length === 0) {
      return []
    }

    const activeContractId = sessionData?.namespaces.profile?.id?.value ?? ''

    return contracts.filter(isSwitchableStoreFrontContract).map((contract) => ({
      id: contract.id,
      corporateName: resolveContractDisplayNameFromStoreFront(contract),
      isActive: contract.id === activeContractId,
    }))
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
