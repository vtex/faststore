import type { Product } from '../clients/apps/search/types/ProductSearchResult'

export const canonicalFromProduct = ({ linkText }: Product) => `/${linkText}/p`
