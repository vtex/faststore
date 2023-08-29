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
import { GetStaticProps } from 'next'
import GlobalSections, {
  getGlobalSectionsData,
  GlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import { getPage, SearchContentType } from 'src/server/cms'
import storeConfig from '../../faststore.config'
import SearchPage from 'src/components/templates/SearchPage/SearchPage'

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

        <UISROnly as="h1" text={title} />

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

export const getStaticProps: GetStaticProps<
  Props,
  Record<string, string>,
  Locator
> = async ({ previewData }) => {
  const [page, globalSections] = await Promise.all([
    getPage<SearchContentType>({
      ...(previewData?.contentType === 'search' ? previewData : null),
      contentType: 'search',
    }),
    getGlobalSectionsData(previewData),
  ])

  return {
    props: {
      page,
      globalSections,
    },
  }
}

Page.displayName = 'Page'

export default mark(Page)
