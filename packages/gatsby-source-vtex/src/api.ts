export interface SearchOptions {
  sc?: number
  simulation?: 'true' | 'false'
}

export interface FilterOptions {
  slug?: string
  term?: string
  fullText?: string
  categoryIds?: string[]
  productIds?: string[]
  specification?: {
    id: string
    value: string
  }
  price?: {
    from: number
    to: number
  }
  collectionId?: string
  skuId?: string
  referenceId?: string
  sellerId?: string
  ean13?: string
  from?: number
  to?: number
}

const EMTPY_OBJ = {}

const SEARCH_ROOT = `/api/catalog_system/pub/products/search`

const search = (
  {
    slug,
    term,
    fullText,
    categoryIds,
    productIds,
    specification: spec,
    price,
    collectionId,
    skuId,
    referenceId,
    sellerId,
    ean13,
    from,
    to,
  }: FilterOptions,
  { sc = 1, simulation = 'false' }: SearchOptions = EMTPY_OBJ
) => {
  if (slug) {
    return `${SEARCH_ROOT}/${slug}/p?sc=${sc}&simulation=${simulation}`
  }

  if (term) {
    return `${SEARCH_ROOT}/${term}?sc=${sc}&simulation=${simulation}`
  }

  const querystring = [
    ['ft=', fullText],
    [
      'fq=C:',
      categoryIds && categoryIds.length > 0
        ? `/${categoryIds?.join('/')}/`
        : null,
    ],
    ...(productIds?.map((pId) => ['fq=productId:', pId]) ?? []),
    ['fq=specificationFilter_', spec && `${spec.id}:${spec.value}`],
    ['fq=P:', price && `[{${price.from}} TO {${price.to}}]`],
    ['fq=productClusterIds:', collectionId],
    ['fq=skuId:', skuId],
    ['fq=alternateIds_RefId:', referenceId],
    ['fq=alternateIds_Ean:', ean13],
    ['fq=sellerId:', sellerId],
    ['_from=', from],
    ['_to=', to],
    ['sc=', sc],
    ['simulation=', simulation],
  ].reduce((acc, [label, val]) => {
    if (val == null) {
      return acc
    }

    const element = `${label}${val}`

    if (acc.length === 0) {
      return element
    }

    return `${acc}&${element}`
  }, '')

  if (querystring.length === 0) {
    return SEARCH_ROOT
  }

  return `${SEARCH_ROOT}?${querystring}`
}

const nonNull = <T>(x: T | null): x is T => x != null

const facets = ({
  department,
  category,
  brand,
}: Record<string, string | undefined>) => {
  const query = [department, category, brand].filter(nonNull).join('/')
  const map = [department && 'c', category && 'c', brand && 'b']
    .filter(nonNull)
    .join('/')

  return `/api/catalog_system/pub/facets/search/${query}?map=${map}`
}

export const api = {
  search,
  facets,
  catalog: {
    category: {
      tree: (depth: number) => `/api/catalog_system/pub/category/tree/${depth}`,
    },
  },
  checkout: {
    orderForm: '/api/checkout/pub/orderForm',
    addItem: (orderFormId: string) =>
      `/api/checkout/pub/orderForm/${orderFormId}/items`,
  },
  sessions: {
    segment: `/api/segments`,
  },
  tenants: {
    tenant: (tennant: string) => `/api/tenant/tenants?q=${tennant}`,
  },
}
