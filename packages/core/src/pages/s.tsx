import type { SearchState } from '@faststore/sdk'
import {
  formatSearchState,
  parseSearchState,
  SearchProvider,
} from '@faststore/sdk'
import { SROnly as UISROnly } from '@faststore/ui'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import { ITEMS_PER_PAGE } from 'src/constants'
import { useApplySearchState } from 'src/sdk/search/state'
import { mark } from 'src/sdk/tests/mark'

import { Locator } from '@vtex/client-cms'
import storeConfig from 'faststore.config'
import { GetServerSideProps } from 'next'
import GlobalSections, {
  getGlobalSectionsData,
  GlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import SearchPage from 'src/components/templates/SearchPage/SearchPage'
import { getPage, SearchContentType } from 'src/server/cms'
import type {
  ClientProductGalleryQueryQuery as ClientProductGalleryQuery,
  ClientProductGalleryQueryQueryVariables as ClientProductGalleryQueryVariables,
} from '@generated/graphql'
import { execute } from 'src/server'
import { query as ProductGalleryQuery } from 'src/sdk/product/useProductGalleryQuery'

type Props = {
  page: SearchContentType
  globalSections: GlobalSectionsData
}

export interface SearchPageContextType {
  title: string
  searchTerm?: string
}

type UseSearchParams = {
  sort: SearchState['sort']
}

const useSearchParams = ({ sort: defaultSort }: UseSearchParams) => {
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
  const searchParams = useSearchParams({
    sort: settings?.productGallery?.sortBySelection as SearchState['sort'],
  })
  const applySearchState = useApplySearchState()
  const title = 'Search Results'
  const { description, titleTemplate } = storeConfig.seo

  const itemsPerPage = settings?.productGallery?.itemsPerPage ?? ITEMS_PER_PAGE

  if (!searchParams) {
    return null
  }

  const server = {
    title,
    searchTerm: searchParams.term ?? undefined,
  } as SearchPageContextType

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
        <SearchPage page={searchContentType} data={server}></SearchPage>
      </SearchProvider>
    </GlobalSections>
  )
}

export const getServerSideProps: GetServerSideProps<
  Props,
  Record<string, string>,
  Locator
> = async ({ previewData, query: parsedUrlQuery }) => {
  // Redirect when there are registered Intelligent Search redirects
  const queryTerm = parsedUrlQuery?.q as string

  if (queryTerm) {
    try {
      const {
        data: { redirect },
      } = await execute<
        ClientProductGalleryQueryVariables,
        ClientProductGalleryQuery
      >({
        variables: {
          first: 1,
          after: '0',
          sort: 'score_desc' as const,
          term: queryTerm,
          selectedFacets: [],
        },
        operation: ProductGalleryQuery,
      })

      if (redirect?.url) {
        return {
          props: null,
          redirect: {
            permanent: false,
            destination: redirect.url,
          },
        }
      }
    } catch (error) {
      console.error(`Failed to redirect. Error: ${error}`)
    }
  }
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

Page.displayName = 'Page'

export default mark(Page)
