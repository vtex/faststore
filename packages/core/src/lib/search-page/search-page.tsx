import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import type { SearchState } from '@vtex/faststore-sdk'
import { SearchProvider } from '@vtex/faststore-sdk'
import { SROnly as UISROnly } from '@vtex/faststore-ui'
import { ITEMS_PER_PAGE } from '../../constants'
import { useApplySearchState } from '../../sdk/search/state'
import storeConfig from '../../../discovery.config'
import { SearchWrapper } from '../../components/templates/SearchPage'
import type { SearchPageProps } from '../../experimental/searchServerSideFunctions'
import { useSearchParams } from './use-search-params'

export function SearchPage(props: SearchPageProps) {
  const {
    page: searchContentType,
    globalSections: globalSectionsProp,
    searchTerm: serverSearchTerm,
  } = props
  const router = useRouter()
  const { sections: globalSections, settings: globalSettings } =
    globalSectionsProp ?? {}
  const { settings } = searchContentType
  const applySearchState = useApplySearchState()
  const searchParams = useSearchParams({
    sort: settings?.productGallery?.sortBySelection as SearchState['sort'],
  })

  const itemsPerPage = settings?.productGallery?.itemsPerPage ?? ITEMS_PER_PAGE
  const searchTerm =
    serverSearchTerm ??
    (router.query?.q as string) ??
    searchParams.term ??
    undefined

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
        serverData={{ title: seoData.title, searchTerm }}
        globalSections={globalSections}
        globalSettings={globalSettings}
      />
    </SearchProvider>
  )
}

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
    ? `${storeConfig.storeUrl}/s?q=${searchTerm.replaceAll(' ', '+')}`
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

export interface SearchPageContextType {
  title: string
  searchTerm?: string
}

type StoreConfig = typeof storeConfig
