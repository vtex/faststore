import { FormattedMessage } from 'react-intl'
import React, { Suspense } from 'react'
import { Box, Spinner } from 'theme-ui'
import type { FC, ComponentType } from 'react'

import Center from '../Center'
import SearchSuggestionsContainer from './base/Container'
import SearchSuggestionsList from './base/List'
import SearchSuggestionsTitle from './base/Title'
import SearchSuggestionsTotal from './base/Total'
import { useSearchSuggestions } from './base/useSearchSuggestions'

interface Item {
  key: string
}

export type SummaryComponent = ComponentType<{ product: Item }>

interface Props {
  SummaryComponent: SummaryComponent
  items: Item[] | undefined
  total: number | undefined
  term: string
  variant?: string
}

const SearchSuggestionsProduct: FC<Required<Props>> = ({
  items,
  total,
  variant,
  SummaryComponent,
  term,
}) => {
  const {
    searchBar: { onSearch },
  } = useSearchSuggestions()

  return (
    <>
      <SearchSuggestionsList items={items as any} variant={variant}>
        {({ item, variant: v }: any) => (
          <Box data-testid="searchSuggestionsItem" variant={v}>
            <Suspense fallback={null}>
              <SummaryComponent product={item} />
            </Suspense>
          </Box>
        )}
      </SearchSuggestionsList>
      <SearchSuggestionsTotal variant={variant} onClick={() => onSearch(term)}>
        <FormattedMessage id="suggestions.products.total" values={{ total }} />
      </SearchSuggestionsTotal>
    </>
  )
}

const SearchSuggestions: FC<Props> = ({
  variant = 'products',
  items,
  total,
  term,
  SummaryComponent,
}) => (
  <SearchSuggestionsContainer variant={variant}>
    <SearchSuggestionsTitle variant={variant}>
      <FormattedMessage id="suggestions.products.title" values={{ term }} />
    </SearchSuggestionsTitle>

    {items == null ? (
      <Center>
        <Spinner />
      </Center>
    ) : total === 0 ? (
      <Center>
        <FormattedMessage id="suggestions.products.notFound" />
      </Center>
    ) : (
      <SearchSuggestionsProduct
        items={items}
        total={total}
        variant={variant}
        SummaryComponent={SummaryComponent}
        term={term}
      />
    )}
  </SearchSuggestionsContainer>
)

export default SearchSuggestions
