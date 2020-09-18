import { Box, CenteredSpinner } from '@vtex/store-ui'
import React, { FC } from 'react'

import { SearchSuggestionsListContainer } from '../base/Container'
import { SearchSuggestionsListTitle } from '../base/Title'
import { SearchSuggestionsListTotal } from '../base/Total'
import { SearchSuggestionsList } from '../base/List'
import { ProductSummary } from '../../ProductSummary'
import { useProductsSuggestions } from './hooks'
import { toRequiredItem } from '../base/hooks'

interface Props {
  title: string
  maxItems?: number
  variant?: string
  countDesc: (count: number) => string
}

const SearchSuggestionsProduct: FC<Required<Props>> = ({
  title,
  variant,
  maxItems,
  countDesc,
}) => {
  const {
    query: { data, error },
    searchBar: { onSearch },
    term,
  } = useProductsSuggestions({
    maxItems,
  })

  const count = data?.vtex.productSuggestions?.count
  const products = data?.vtex.productSuggestions.products

  if (error || !products || products.length === 0) {
    return null
  }

  const items = toRequiredItem(products)

  return (
    <>
      <SearchSuggestionsListTitle
        variant={variant}
        title={`${title} ${term}`}
      />
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
        {countDesc(count!)}
      </SearchSuggestionsListTotal>
    </>
  )
}

const SearchSuggestions: FC<Props> = ({
  variant = 'products',
  maxItems = 3,
  countDesc,
  title,
}) => (
  <SearchSuggestionsListContainer
    variant={variant}
    fallback={<CenteredSpinner />}
  >
    <SearchSuggestionsProduct
      title={title}
      variant={variant}
      maxItems={maxItems}
      countDesc={countDesc}
    />
  </SearchSuggestionsListContainer>
)

export default SearchSuggestions
