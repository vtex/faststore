/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { UIButton } from '@vtex/store-ui'
import React from 'react'
import type { FC } from 'react'

import Page from './Page'
import { useSearch } from '../../../sdk/search/useSearch'
import { useSearchInfinite } from '../../../sdk/search/useSearchInfinite'
import type { SearchQueryQuery } from './__generated__/SearchQuery.graphql'

interface Props {
  columns: number[]
  initialData: SearchQueryQuery | undefined
}

const List: FC<Props> = ({ columns, initialData }) => {
  const { formatMessage } = useIntl()
  const { pageInfo, searchParams } = useSearch()
  const {
    pages,
    nextPage,
    previousPage,
    fetchNextPage,
    fetchPreviousPage,
  } = useSearchInfinite()

  const nextLabel = formatMessage({ id: 'search.page-list.next' })
  const previousLabel = formatMessage({ id: 'search.page-list.previous' })

  return (
    <>
      {previousPage !== false && (
        <UIButton
          as="a"
          variant="loadMore"
          onClick={fetchPreviousPage}
          aria-label={previousLabel}
          {...{ href: pageInfo.previous }}
        >
          {previousLabel}
        </UIButton>
      )}
      {pages.map((page) => (
        <Page
          key={`search-result-page-${page}`}
          initialData={page === searchParams.page ? initialData : undefined}
          columns={columns}
          cursor={page}
          display
        />
      ))}
      {nextPage !== false && (
        <UIButton
          as="a"
          variant="loadMore"
          onClick={fetchNextPage}
          aria-label={nextLabel}
          {...{ href: pageInfo.next }}
        >
          {nextLabel}
        </UIButton>
      )}
      {/* Prefetch Previous pages */}
      {previousPage !== false && (
        <Page columns={columns} cursor={previousPage} display={false} />
      )}
      {/* Prefetch Next page */}
      {nextPage !== false && (
        <Page columns={columns} cursor={nextPage} display={false} />
      )}
    </>
  )
}

export default List
