import { Box, Center, Spinner } from '@vtex/store-ui'
import React, { FC, Suspense, lazy } from 'react'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

import { SearchSuggestionsListContainer } from '../base/Container'
import { SearchSuggestionsListTitle } from '../base/Title'
import { SearchSuggestionsListTotal } from '../base/Total'
import { SearchSuggestionsList } from '../base/List'
import { useProductsSuggestions } from './hooks'
import { toRequiredItem } from '../base/hooks'

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
      defaultMessage: 'Products for: {term}',
    },
    { term }
  )

  const total = formatMessage(
    {
      id: 'suggestions.products.total',
      defaultMessage: 'See all {count} items',
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
            defaultMessage: 'No products found',
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
