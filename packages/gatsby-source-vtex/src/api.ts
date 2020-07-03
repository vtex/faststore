interface SearchOptions {
  sc?: number
  simulation?: 'true' | 'false'
}

export interface FilterOptions {
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

const searchByFilters = (
  {
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

export const api = {
  search: {
    byTerm: (
      term: string,
      { sc = 1, simulation = 'false' }: SearchOptions = EMTPY_OBJ
    ) => `${SEARCH_ROOT}/${term}?sc=${sc}&simulation=${simulation}`,
    bySlug: (
      slug: string,
      { sc = 1, simulation = 'false' }: SearchOptions = EMTPY_OBJ
    ) => `${SEARCH_ROOT}/${slug}/p?sc=${sc}&simulation=${simulation}`,
    byFilters: searchByFilters,
  },
  catalog: {
    category: {
      tree: (depth: number) => `/api/catalog_system/pub/category/tree/${depth}`,
    },
  },
  sessions: {
    segment: `/api/segments`,
  },
  tenants: {
    tenant: (tennant: string) => `/api/tenant/tenants?q=${tennant}`,
  },
}
