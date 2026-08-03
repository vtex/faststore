import { useMemo } from 'react'

import type { ClientManyProductsQueryQueryVariables } from '@generated/graphql'
import { useRouter } from 'next/router'

import storeConfig from 'discovery.config'
import { ITEMS_PER_SECTION } from 'src/constants'
import { useSession } from 'src/sdk/session'
import { toArray } from 'src/utils/utilities'

export const useLocalizedVariables = ({
  first,
  after,
  sort,
  term,
  selectedFacets,
  sponsoredCount,
}: Partial<ClientManyProductsQueryQueryVariables>) => {
  const { channel, locale: sessionLocale } = useSession()
  const router = useRouter()

  // Prefer router.locale over session.locale: Next.js i18n exposes the locale
  // prefix as router.locale (always current), while session.locale can lag on
  // navigation.
  const locale = useMemo(() => {
    if (storeConfig.localization?.enabled) {
      return router.locale ?? sessionLocale
    }
    return sessionLocale
  }, [router.locale, sessionLocale])

  return useMemo(() => {
    return {
      first: first ?? ITEMS_PER_SECTION,
      after: String(after ?? 0),
      sort: sort ?? ('score_desc' as const),
      term: term ?? '',
      selectedFacets: [
        ...toArray(selectedFacets),
        { key: 'channel', value: channel ?? '' },
        { key: 'locale', value: locale },
      ],
      sponsoredCount: sponsoredCount ?? 3,
    }
  }, [
    selectedFacets,
    first,
    after,
    sort,
    term,
    channel,
    locale,
    sponsoredCount,
  ])
}
