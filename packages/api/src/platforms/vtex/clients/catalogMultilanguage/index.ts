import { fetchAPI } from '../fetch'
import { getWithAppKeyAndToken } from '../../utils/auth'

export interface ProductLanguageEntry {
  Id: number
  Locale: string
  Name: string | null
  LinkId: string | null
}

export interface CategoryLanguageEntry {
  Id: number
  Locale: string
  Name: string | null
  LinkId: string | null
  Title: string | null
  Description: string | null
  Keywords: string | null
}

export const CatalogMultilanguage = ({
  account,
  environment,
}: Pick<Options, 'account' | 'environment'>) => {
  const base = `https://${account}.${environment}.com.br`
  const withAppKeyAndToken = getWithAppKeyAndToken()

  return {
    /**
     * Returns localized data for all registered locales of a product.
     * Used to validate localized slugs and to build otherLocales for hreflang.
     */
    getProductLanguages: (productId: string): Promise<ProductLanguageEntry[]> =>
      fetchAPI(`${base}/api/catalog/pvt/product/${productId}/language`, {
        method: 'GET',
        headers: withAppKeyAndToken({ 'Content-Type': 'application/json' }),
      }),

    /**
     * Returns localized data for a single category in a given locale.
     * Used to build localized breadcrumb links.
     */
    getCategoryLanguage: (
      categoryId: string,
      locale: string
    ): Promise<CategoryLanguageEntry | null> =>
      fetchAPI(
        `${base}/api/catalog/pvt/category/${categoryId}/language/${locale}`,
        {
          method: 'GET',
          headers: withAppKeyAndToken({ 'Content-Type': 'application/json' }),
        }
      ).catch(() => null),
  }
}
