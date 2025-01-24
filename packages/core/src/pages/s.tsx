import type { GetServerSideProps } from 'next'
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

import { Locator } from '@vtex/client-cms'
import storeConfig from 'discovery.config'
import {
  getGlobalSectionsData,
  GlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import { SearchWrapper } from 'src/components/templates/SearchPage'
import { getPage, SearchContentType } from 'src/server/cms'

type Props = {
  page: SearchContentType
  globalSections: GlobalSectionsData
  searchTerm?: string
}

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

function Page({ page: searchContentType, globalSections, searchTerm }: Props) {
  const { settings } = searchContentType
  const applySearchState = useApplySearchState()
  const searchParams = useSearchParams({
    sort: settings?.productGallery?.sortBySelection as SearchState['sort'],
  })

  const title = 'Search Results'
  const { description, titleTemplate } = storeConfig.seo
  const itemsPerPage = settings?.productGallery?.itemsPerPage ?? ITEMS_PER_PAGE

  if (!searchParams) {
    return null
  }

  const isSSREnabled = storeConfig.experimental.enableSearchSSR

  const currentSearchTerm = isSSREnabled ? searchTerm : searchParams.term
  const currentTitle = isSSREnabled ? searchTerm : title
  const currentDescription = isSSREnabled
    ? `${searchTerm}: em promoção que você procura? Na Americanas você encontra as melhores ofertas de produtos com entrega rápida. Vem!`
    : description

  return (
    <SearchProvider
      onChange={applySearchState}
      itemsPerPage={itemsPerPage}
      {...searchParams}
    >
      {/* SEO */}
      <NextSeo
        noindex
        title={currentTitle}
        description={currentDescription}
        titleTemplate={titleTemplate}
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

export const getServerSideProps: GetServerSideProps<
  Props,
  Record<string, string>,
  Locator
> = async (context) => {
  const { previewData, query, res } = context

  const searchTerm = (query.q as string)?.split('+').join(' ')

  const globalSections = await getGlobalSectionsData(previewData)

  if (storeConfig.cms.data) {
    const cmsData = JSON.parse(storeConfig.cms.data)
    const page = cmsData['search'][0]

    if (page) {
      const pageData = await getPage<SearchContentType>({
        contentType: 'search',
        documentId: page.documentId,
        versionId: page.versionId,
      })

      return {
        props: { page: pageData, globalSections, searchTerm },
      }
    }
  }

  const page = await getPage<SearchContentType>({
    ...(previewData?.contentType === 'search' ? previewData : null),
    contentType: 'search',
  })

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=31536000'
  ) // 5 minutes of fresh content and 1 year of stale content

  return {
    props: {
      page,
      globalSections,
      searchTerm,
    },
  }
}

export default Page
