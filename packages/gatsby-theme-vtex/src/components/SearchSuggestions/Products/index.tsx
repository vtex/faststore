import { Box, CenteredSpinner, Flex } from '@vtex/store-ui'
import React, { FC } from 'react'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

import { SearchSuggestionsListContainer } from '../base/Container'
import { SearchSuggestionsListTitle } from '../base/Title'
import { SearchSuggestionsListTotal } from '../base/Total'
import { SearchSuggestionsList } from '../base/List'
import { ProductSummary } from '../../ProductSummary'
import { useProductsSuggestions } from './hooks'
import { toRequiredItem } from '../base/hooks'

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

  if (count === 0) {
    return (
      <>
        <SearchSuggestionsListTitle variant={variant} title={title} />
        <Flex sx={{ justifyContent: 'center', alignItems: 'center' }}>
          {formatMessage({
            id: 'suggestions.products.notFound',
            defaultMessage: 'No products found',
          })}
        </Flex>
      </>
    )
  }

  if (error || !products) {
    return null
  }

  return (
    <>
      <SearchSuggestionsListTitle variant={variant} title={title} />
      <SearchSuggestionsList items={items as any} variant={variant}>
        {({ item, variant: v }: any) => (
          <Box variant={v}>
            <ProductSummary product={item} />
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

const Fallback = () => {
  console.log('fallback')

  return <CenteredSpinner />
}

const SearchSuggestions: FC<Props> = ({
  variant = 'products',
  maxItems = 3,
  term,
}) => (
  <SearchSuggestionsListContainer fallback={<Fallback />} variant={variant}>
    <SearchSuggestionsProduct
      maxItems={maxItems}
      variant={variant}
      term={term}
    />
  </SearchSuggestionsListContainer>
)

export default SearchSuggestions
