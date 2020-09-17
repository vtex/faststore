import {
  Box,
  CenteredSpinner,
  SearchSuggestionsList,
  SearchSuggestionsListTitle,
  SearchSuggestionsListContainer,
  useSearchSuggestionsContext,
  SearchSuggestionsListTotal,
} from '@vtex/store-ui'
import React, { FC } from 'react'

import { useProductsSuggestions } from '../../sdk/searchSuggestions/useProducts'
import { ProductSummary } from '../ProductSummary'

interface Props {
  title: string
  maxItems?: number
  variant?: string
  countDesc: (count: number) => string
}

const SearchSuggestionsProduct: FC<Props> = ({
  title,
  maxItems,
  countDesc,
  variant = 'products',
}) => {
  const { onSearch, term } = useSearchSuggestionsContext()
  const { data, isValidating, error } = useProductsSuggestions({
    term: term!,
    maxItems,
  })

  const count = data?.vtex.productSuggestions?.count
  const products = data?.vtex.productSuggestions.products
  const loading = isValidating && !data

  if (loading) {
    return (
      <SearchSuggestionsListContainer variant={variant}>
        <CenteredSpinner />
      </SearchSuggestionsListContainer>
    )
  }

  if (error || !products || !count || count === 0) {
    return <SearchSuggestionsListContainer variant={variant} />
  }

  return (
    <SearchSuggestionsListContainer variant={variant}>
      <SearchSuggestionsListTitle
        variant={variant}
        title={`${title} ${term}`}
      />
      <SearchSuggestionsList items={products as any} variant={variant}>
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
    </SearchSuggestionsListContainer>
  )
}

export default SearchSuggestionsProduct
