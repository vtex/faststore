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
  SearchPageProps,
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

  const { description, titleTemplate, search } = storeConfig.seo
  const itemsPerPage = settings?.productGallery?.itemsPerPage ?? ITEMS_PER_PAGE

  if (!searchParams) {
    return null
  }
  const title = search?.title ?? 'Search Results'
  const currentTitleTemplate = search?.titleTemplate ?? titleTemplate

  const isSSREnabled = storeConfig.experimental.enableSearchSSR

  const currentSearchTerm = isSSREnabled ? searchTerm : searchParams.term
  const currentTitle = isSSREnabled ? searchTerm : title
  const currentDescription = isSSREnabled
    ? search.descriptionTemplate.replace(/%s/g, () => searchTerm)
    : description

  const canonical = currentSearchTerm
    ? `${storeConfig.storeUrl}?s=${currentSearchTerm}`
    : undefined

  return (
    <SearchProvider
      onChange={applySearchState}
      itemsPerPage={itemsPerPage}
      {...searchParams}
    >
      {/* SEO */}
      <NextSeo
        canonical={canonical}
        noindex
        title={currentTitle}
        description={currentDescription}
        titleTemplate={currentTitleTemplate}
        openGraph={{
          type: 'website',
          title: currentTitle,
          description: currentDescription,
        }}
      />

      <UISROnly text={currentTitle} />

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
          title,
          searchTerm: currentSearchTerm ?? undefined,
        }}
        globalSections={globalSections.sections}
      />
    </SearchProvider>
  )
}

export { getStaticProps }

export default Page
