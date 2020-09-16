import {
  Box,
  Flex,
  Button,
  Spinner,
  SearchSuggestionsList,
  useSearchSuggestionsContext,
} from '@vtex/store-ui'
import React, { FC } from 'react'

import { useProductsSuggestions } from '../../../sdk/searchSuggestions/useProducts'
import { ProductSummary } from '../../ProductSummary'

interface Props {
  title: string
  maxItems?: number
  variant?: string
  countDesc: (count: number) => string
}

const Container: FC<{ variant: string }> = ({ variant, children }) => (
  <Box variant={`suggestions.${variant}`}>{children}</Box>
)

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
  const notFound = !products || !count || count === 0

  if (loading) {
    return (
      <Flex
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          variant: `suggestions.${variant}`,
        }}
      >
        <Spinner />
      </Flex>
    )
  }

  if (error || notFound) {
    return <Container variant={variant} />
  }

  return (
    <Container variant={variant}>
      <SearchSuggestionsList
        items={products!}
        variant={variant}
        title={`${title} ${term}`}
      >
        {({ item, variant: v }) => (
          <Box as="li" variant={v} key={item!.linkText}>
            <ProductSummary product={item!} />
          </Box>
        )}
      </SearchSuggestionsList>
      <Button
        variant={`suggestions.${variant}.count`}
        onClick={() => onSearch(term!)}
      >
        {countDesc(count!)}
      </Button>
    </Container>
  )
}

export default SearchSuggestionsProduct
