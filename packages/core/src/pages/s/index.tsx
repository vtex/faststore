// Keep this page at `s/index.tsx`; do not rename it back to a bare `s.tsx`.
// Next.js maps both to the same `/s` route, but Yarn Classic 1.x loses the
// bare `s.tsx` while extracting @faststore/core on Windows: right after
// `yarn install` the file is already absent from node_modules, while every
// sibling page survives, and `next build` then fails type-checking with a
// misleading "Cannot find module 'src/pages/s'". Extracting the same tarball
// with Windows' own `tar.exe` keeps the file, so the loss happens inside
// Yarn's extractor rather than in how we pack or copy. Why Yarn drops this
// particular entry is not pinned down, but nesting the page under a folder
// avoids it. Investigation and the before/after Windows CI runs that verified
// this layout: https://github.com/vtex/faststore/pull/3486
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import type { SearchState } from '@faststore/sdk'
import type { SearchSettings } from 'src/server/cms'
import {
  formatSearchState,
  parseSearchState,
  SearchProvider,
} from '@faststore/sdk'
import { SROnly as UISROnly } from '@faststore/ui'

import { ITEMS_PER_PAGE } from 'src/constants'
import { useApplySearchState } from 'src/sdk/search/state'

import storeConfig from 'discovery.config'

import { SearchWrapper } from 'src/components/templates/SearchPage'
import {
  getStaticProps,
  type SearchPageProps,
} from 'src/experimental/searchServerSideFunctions'
import { getStoreURL } from 'src/sdk/localization/useLocalizationConfig'

export interface SearchPageContextType {
  title: string
  searchTerm?: string
}

const useSearchParams = ({
  sort: defaultSort,
}: {
  sort: SearchState['sort']
}) => {
  const { asPath } = useRouter()

  return useMemo(() => {
    const url = new URL(asPath, 'http://localhost')

    const shouldUpdateDefaultSort = defaultSort && !url.searchParams.has('sort')
    if (shouldUpdateDefaultSort) {
      url.searchParams.set('sort', defaultSort)
    }

    const newState = parseSearchState(url)
    const hrefState = formatSearchState(newState).href
    return parseSearchState(new URL(hrefState))
  }, [asPath, defaultSort])
}

type StoreConfig = typeof storeConfig

function generateSEOData(
  storeConfig: StoreConfig,
  searchTerm?: string,
  pageSeoSettings?: SearchSettings['settings']['seo'],
  locale?: string
) {
  const { search: searchSeo, ...seo } = storeConfig.seo

  const isSSREnabled = storeConfig.experimental.enableSearchSSR

  const title = searchTerm ?? seo.title ?? 'Search Results'
  const titleTemplate =
    pageSeoSettings?.titleTemplate ??
    searchSeo?.titleTemplate ??
    seo.titleTemplate
  const description = searchSeo?.descriptionTemplate
    ? searchSeo.descriptionTemplate
        .replace(/%s/g, () => searchTerm ?? '')
        ?.trim()
    : seo.description?.trim()

  // default behavior without SSR
  if (!isSSREnabled) {
    return {
      noindex: searchSeo?.noIndex ?? true,
      nofollow: searchSeo?.noFollow ?? true,
      title,
      titleTemplate,
      description,
      openGraph: {
        type: 'website',
        title,
        description,
      },
    }
  }

  const canonical = searchTerm
    ? `${getStoreURL(locale).replace(/\/$/, '')}/s?q=${searchTerm.replaceAll(
        ' ',
        '+'
      )}`
    : undefined

  return {
    noindex: searchSeo?.noIndex ?? true,
    nofollow: searchSeo?.noFollow ?? true,
    title,
    description,
    titleTemplate,
    canonical,
    openGraph: {
      type: 'website',
      title: title,
      description: description,
    },
  }
}

function Page({
  page: searchContentType,
  globalSections: globalSectionsProp,
  searchTerm,
}: SearchPageProps) {
  const { sections: globalSections, settings: globalSettings } =
    globalSectionsProp ?? {}
  const { settings } = searchContentType
  const { locale } = useRouter()
  const applySearchState = useApplySearchState()
  const searchParams = useSearchParams({
    sort: settings?.productGallery?.sortBySelection as SearchState['sort'],
  })

  const itemsPerPage = settings?.productGallery?.itemsPerPage ?? ITEMS_PER_PAGE

  if (!searchParams) {
    return null
  }

  const [effectiveSearchTerm, setEffectiveSearchTerm] = useState<
    string | undefined
  >(() => searchTerm ?? undefined)

  useEffect(() => {
    if (!searchTerm && searchParams.term) {
      setEffectiveSearchTerm(searchParams.term)
    }
  }, [searchParams.term, searchTerm])

  const { noindex, nofollow, ...seoData } = generateSEOData(
    storeConfig,
    effectiveSearchTerm,
    settings?.seo,
    locale
  )

  return (
    <SearchProvider
      onChange={applySearchState}
      itemsPerPage={itemsPerPage}
      shouldResetInfiniteScroll={!storeConfig.experimental?.scrollRestoration}
      {...searchParams}
    >
      {/* SEO */}
      <NextSeo noindex={noindex} nofollow={nofollow} {...seoData} />

      <UISROnly text={seoData.title} />

      {/*
          WARNING: Do not import or render components from any
          other folder than '../components/sections' in here.

          This is necessary to keep the integration with the CMS
          easy and consistent, enabling the change and reorder
          of elements on this page.

          If needed, wrap your component in a <Section /> component
          (not the HTML tag) before rendering it here.
        */}
      <SearchWrapper
        itemsPerPage={itemsPerPage}
        searchContentType={searchContentType}
        serverData={{
          title: seoData.title,
          searchTerm: effectiveSearchTerm,
        }}
        globalSections={globalSections}
        globalSettings={globalSettings}
      />
    </SearchProvider>
  )
}

export { getStaticProps }

export default Page
