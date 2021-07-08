/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React from 'react'
import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { UIButton } from '@vtex/store-ui'
import type { FC } from 'react'

import Page from './Page'
import { useSearch } from '../../../sdk/search/useSearch'
import type { SearchQueryQuery } from './__generated__/SearchQuery.graphql'

interface Props {
  columns: number[]
  initialData: SearchQueryQuery | undefined
}

const List: FC<Props> = ({ columns, initialData }) => {
  const { formatMessage } = useIntl()
  const {
    searchParams,
    pageInfo: {
      nextPage: next,
      prevPage: previous,
      pages,
      addNextPage: setNextPage,
      addPreviousPage: fetchPreviousPage,
    },
  } = useSearch()

  const nextLabel = formatMessage({ id: 'search.page-list.next' })
  const prevLabel = formatMessage({ id: 'search.page-list.previous' })

  return (
    <>
      {previous !== false && (
        <UIButton
          as="a"
          variant="loadMore"
          onClick={fetchPreviousPage}
          aria-label={prevLabel}
          {...{ href: previous.link, rel: 'prev' }}
        >
          {prevLabel}
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
      {next !== false && (
        <UIButton
          as="a"
          variant="loadMore"
          onClick={setNextPage}
          aria-label={nextLabel}
          {...{ href: next.link, rel: 'next' }}
        >
          {nextLabel}
        </UIButton>
      )}
      {/* Prefetch Previous pages */}
      {previous !== false && (
        <Page columns={columns} cursor={previous.cursor} display={false} />
      )}
      {/* Prefetch Next page */}
      {next !== false && (
        <Page columns={columns} cursor={next.cursor} display={false} />
      )}
    </>
  )
}

export default List
