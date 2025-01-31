import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import type { SearchState } from '@faststore/sdk'
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

function generateSEOData(storeConfig: StoreConfig, searchTerm?: string) {
  const { search: searchSeo, ...seo } = storeConfig.seo

  const isSSREnabled = storeConfig.experimental.enableSearchSSR

  // default behavior without SSR
  if (!isSSREnabled) {
    return {
      noindex: searchSeo?.noIndex ?? true,
      nofollow: searchSeo?.noFollow ?? true,
      title: seo.title,
      description: seo.description,
      titleTemplate: seo.titleTemplate,
      openGraph: {
        type: 'website',
        title: seo.title,
        description: seo.description,
      },
    }
  }

  const title = searchTerm ?? 'Search Results'
  const titleTemplate = searchSeo?.titleTemplate ?? seo.titleTemplate
  const description = searchSeo?.descriptionTemplate
    ? searchSeo.descriptionTemplate.replace(/%s/g, () => searchTerm)
    : seo.description

  const canonical = searchTerm
    ? `${storeConfig.storeUrl}/s?q=${searchTerm}`
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
  globalSections,
  searchTerm,
}: SearchPageProps) {
  const { settings } = searchContentType
  const applySearchState = useApplySearchState()
  const searchParams = useSearchParams({
    sort: settings?.productGallery?.sortBySelection as SearchState['sort'],
  })

  const itemsPerPage = settings?.productGallery?.itemsPerPage ?? ITEMS_PER_PAGE

  if (!searchParams) {
    return null
  }

  const { noindex, nofollow, ...seoData } = generateSEOData(
    storeConfig,
    searchTerm
  )

  return (
    <SearchProvider
      onChange={applySearchState}
      itemsPerPage={itemsPerPage}
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
          searchTerm: searchTerm ?? searchParams.term ?? undefined,
        }}
        globalSections={globalSections.sections}
      />
    </SearchProvider>
  )
}

export { getStaticProps }

export default Page
