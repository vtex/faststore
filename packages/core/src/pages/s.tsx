import { useMemo } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import type { GetStaticProps } from 'next'

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
import storeConfig from 'faststore.config'
import GlobalSections, {
  getGlobalSectionsData,
  GlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import { SearchWrapper } from 'src/components/templates/SearchPage'
import { getPage, SearchContentType } from 'src/server/cms'
import { usePageViewEvent } from 'src/sdk/analytics/hooks/usePageViewEvent'

type Props = {
  page: SearchContentType
  globalSections: GlobalSectionsData
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

function Page({ page: searchContentType, globalSections }: Props) {
  const { settings } = searchContentType
  const applySearchState = useApplySearchState()
  const searchParams = useSearchParams({
    sort: settings?.productGallery?.sortBySelection as SearchState['sort'],
  })

  const title = 'Search Results'
  const { description, titleTemplate } = storeConfig.seo
  const itemsPerPage = settings?.productGallery?.itemsPerPage ?? ITEMS_PER_PAGE

  usePageViewEvent({ pageTitle: title })

  if (!searchParams) {
    return null
  }

  return (
    <GlobalSections {...globalSections}>
      <SearchProvider
        onChange={applySearchState}
        itemsPerPage={itemsPerPage}
        {...searchParams}
      >
        {/* SEO */}
        <NextSeo
          noindex
          title={title}
          description={description}
          titleTemplate={titleTemplate}
          openGraph={{
            type: 'website',
            title,
            description,
          }}
        />

        <UISROnly text={title} />

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
            searchTerm: searchParams.term ?? undefined,
          }}
        />
      </SearchProvider>
    </GlobalSections>
  )
}

export const getStaticProps: GetStaticProps<
  Props,
  Record<string, string>,
  Locator
> = async ({ previewData }) => {
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
        props: { page: pageData, globalSections },
      }
    }
  }

  const page = await getPage<SearchContentType>({
    ...(previewData?.contentType === 'search' ? previewData : null),
    contentType: 'search',
  })

  return {
    props: {
      page,
      globalSections,
    },
  }
}

export default Page
