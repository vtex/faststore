import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Box, Center, Spinner } from '@vtex/store-ui'
import React, { lazy, Suspense } from 'react'
import type { FC } from 'react'

import { SearchSuggestionsListContainer } from '../base/Container'
import { toRequiredItem } from '../base/hooks'
import { SearchSuggestionsList } from '../base/List'
import { SearchSuggestionsListTitle } from '../base/Title'
import { SearchSuggestionsListTotal } from '../base/Total'
import { useProductsSuggestions } from './hooks'

const ProductSummary = lazy(() => import('../../ProductSummary'))

interface Props {
  term: string
  maxItems?: number
  variant?: string
}

const SearchSuggestionsProduct: FC<Required<Props>> = ({
  term,
  variant,
  maxItems,
}) => {
  const { formatMessage } = useIntl()
  const {
    query: { data, error },
    searchBar: { onSearch },
  } = useProductsSuggestions({
    maxItems,
    term,
  })

  const count = data?.vtex.productSuggestions?.count
  const products = data?.vtex.productSuggestions.products
  const items = products && toRequiredItem(products)

  const title = formatMessage(
    {
      id: 'suggestions.products.title',
    },
    { term }
  )

  const total = formatMessage(
    {
      id: 'suggestions.products.total',
    },
    { count }
  )

  if (error) {
    return null
  }

  if (!products) {
    return (
      <>
        <SearchSuggestionsListTitle variant={variant} title={title} />
        <Center>
          <Spinner />
        </Center>
      </>
    )
  }

  if (count === 0) {
    return (
      <>
        <SearchSuggestionsListTitle variant={variant} title={title} />
        <Center>
          {formatMessage({
            id: 'suggestions.products.notFound',
          })}
        </Center>
      </>
    )
  }

  return (
    <>
      <SearchSuggestionsListTitle variant={variant} title={title} />
      <SearchSuggestionsList items={items as any} variant={variant}>
        {({ item, variant: v }: any) => (
          <Box variant={v}>
            <Suspense fallback={null}>
              <ProductSummary product={item} />
            </Suspense>
          </Box>
        )}
      </SearchSuggestionsList>
      <SearchSuggestionsListTotal
        variant={variant}
        onClick={() => onSearch(term!)}
      >
        {total}
      </SearchSuggestionsListTotal>
    </>
  )
}

const SearchSuggestions: FC<Props> = ({
  variant = 'products',
  maxItems = 3,
  term,
}) => (
  <SearchSuggestionsListContainer variant={variant}>
    <SearchSuggestionsProduct
      maxItems={maxItems}
      variant={variant}
      term={term}
    />
  </SearchSuggestionsListContainer>
)

export default SearchSuggestions
