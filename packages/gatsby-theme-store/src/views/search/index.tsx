import { useLocation } from '@reach/router'
import { SuspenseViewport } from '@vtex/store-ui'
import React, { lazy } from 'react'
import type { FC } from 'react'
import type { SearchParamsState } from '@vtex/store-sdk'

import { usePixelSendEvent } from '../../sdk/pixel/usePixelSendEvent'
import { SearchProvider } from '../../sdk/search/Provider'
import AboveTheFold from './AboveTheFold'
import BelowTheFoldPreview from './BelowTheFoldPreview'
import SEO from './SEO'
import type { ServerSearchPageQueryQuery } from '../../templates/__generated__/ServerSearchPageQuery.graphql'
import type { BrowserSearchPageQueryQuery } from '../../templates/__generated__/BrowserSearchPageQuery.graphql'

const belowTheFoldPreloader = () => import('./BelowTheFold')
const BelowTheFold = lazy(belowTheFoldPreloader)

export interface SearchViewProps {
  pageContext: {
    canonicalPath: string
  }
  data: ServerSearchPageQueryQuery | BrowserSearchPageQueryQuery
  searchParams: SearchParamsState
  pageInfo: { size: number }
}

export const DEFAULT_PAGE_INFO = { size: 12 }

const SearchView: FC<SearchViewProps> = (props) => {
  const { data, searchParams, pageInfo } = props
  const location = useLocation()

  usePixelSendEvent(() => {
    const { term } = searchParams
    const pageType = term ? 'fullText' : 'plp'

    return [
      {
        type: 'vtex:pageView',
        data: {
          pageUrl: window.location.href,
          pageTitle: document.title,
          referrer: document.referrer,
          accountName: process.env.GATSBY_STORE_ID!,
          pageType,
        },
      },
      {
        type: 'vtex:internalSiteSearchView',
        data: {
          accountName: process.env.GATSBY_STORE_ID!,
          pageUrl: window.location.href,
          pageTitle: document.title,
          referrer: document.referrer,
          term: term ?? '',
          results: data.vtex.productSearch?.recordsFiltered ?? 0,
          pageType,
        },
      },
    ]
  }, location.href)

  return (
    <SearchProvider
      searchParams={searchParams}
      data={data}
      pageInfo={{
        size: pageInfo.size,
        total: Math.ceil(
          (data.vtex.productSearch?.recordsFiltered ?? 0) / pageInfo.size
        ),
      }}
    >
      <SEO {...props} />
      <AboveTheFold {...props} />
      <SuspenseViewport
        fallback={<BelowTheFoldPreview {...props} />}
        preloader={belowTheFoldPreloader}
      >
        <BelowTheFold {...props} />
      </SuspenseViewport>
    </SearchProvider>
  )
}

export default SearchView
