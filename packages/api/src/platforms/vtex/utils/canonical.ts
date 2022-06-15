import type { Product } from '../clients/search/types/ProductSearchResult'

export const canonicalFromProduct = ({ linkText }: Product) => `/${linkText}/p`
