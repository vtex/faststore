import {
  formatSearchState,
  initSearchState,
  sendAnalyticsEvent,
} from '@faststore/sdk'
import { SearchInput as UISearchInput } from '@faststore/ui'
import { forwardRef, useCallback } from 'react'
import type { SearchEvent } from '@faststore/sdk'
import type {
  SearchInputProps as UISearchInputProps,
  SearchInputRef,
} from '@faststore/ui'
import { useRouter } from 'next/router'

import useSearchHistory from 'src/sdk/search/useSearchHistory'
import Icon from 'src/components/ui/Icon'

declare type SearchInputProps = {
  onSearchClick?: () => void
  buttonTestId?: string
} & Omit<UISearchInputProps, 'onSubmit'>

const useSearchHanlder = () => {
  const router = useRouter()
  const { addToSearchHistory } = useSearchHistory()

  return useCallback(
    (term: string) => {
      const { pathname, search } = formatSearchState(
        initSearchState({
          term,
          base: '/s',
        })
      )

      sendAnalyticsEvent<SearchEvent>({
        name: 'search',
        params: { search_term: term },
      })

      addToSearchHistory(term)
      router.push(`${pathname}${search}`)
    },
    [addToSearchHistory, router]
  )
}

const SearchInput = forwardRef<SearchInputRef, SearchInputProps>(
  function SearchInput(
    { onSearchClick, buttonTestId = 'store-search-button', ...props },
    ref
  ) {
    const handleSearch = useSearchHanlder()

    return (
      <UISearchInput
        ref={ref}
        icon={
          <Icon
            name="MagnifyingGlass"
            onClick={onSearchClick}
            data-testid={buttonTestId}
          />
        }
        placeholder="Search everything at the store"
        onSubmit={handleSearch}
        {...props}
      />
    )
  }
)

export default SearchInput
