import type { SearchEvent, SearchState } from '@faststore/sdk'

import type {
  SearchInputFieldProps as UISearchInputFieldProps,
  SearchInputFieldRef as UISearchInputFieldRef,
} from '@faststore/ui'
import {
  SearchProviderContextValue,
  SearchInput as UISearchInput,
  SearchInputField as UISearchInputField,
} from '@faststore/ui'
import { useRouter } from 'next/router'
import type { CSSProperties } from 'react'
import {
  Suspense,
  forwardRef,
  lazy,
  useDeferredValue,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import useSearchHistory from 'src/sdk/search/useSearchHistory'
import useSuggestions from 'src/sdk/search/useSuggestions'
import useOnClickOutside from 'src/sdk/ui/useOnClickOutside'

const SearchDropdown = lazy(
  () => import('src/components/search/SearchDropdown')
)

const MAX_SUGGESTIONS = 5

export type SearchInputProps = {
  onSearchClick?: () => void
  buttonTestId?: string
  containerStyle?: CSSProperties
  placeholder?: string
  quickOrder?: boolean
  sort?: string
} & Omit<UISearchInputFieldProps, 'onSubmit'>

export type SearchInputRef = UISearchInputFieldRef & {
  resetSearchInput: () => void
}

const sendAnalytics = async (term: string) => {
  import('@faststore/sdk').then(({ sendAnalyticsEvent }) => {
    sendAnalyticsEvent<SearchEvent>({
      name: 'search',
      params: { search_term: term },
    })
  })
}

const SearchInput = forwardRef<SearchInputRef, SearchInputProps>(
  function SearchInput(
    {
      onSearchClick,
      buttonTestId = 'fs-search-button',
      containerStyle,
      sort,
      placeholder,
      quickOrder = false,
      ...otherProps
    },
    ref
  ) {
    const [searchQuery, setSearchQuery] = useState<string>('')
    const searchQueryDeferred = useDeferredValue(searchQuery)
    const [searchDropdownVisible, setSearchDropdownVisible] =
      useState<boolean>(false)

    const searchRef = useRef<HTMLDivElement>(null)
    const { addToSearchHistory } = useSearchHistory()
    const router = useRouter()

    useImperativeHandle(ref, () => ({
      resetSearchInput: () => setSearchQuery(''),
    }))

    const onSearchSelection: SearchProviderContextValue['onSearchSelection'] = (
      term,
      path
    ) => {
      addToSearchHistory({ term, path })
      sendAnalytics(term)
      setSearchDropdownVisible(false)
      setSearchQuery(term)
    }

    useOnClickOutside(searchRef, () => setSearchDropdownVisible(false))

    const { data, error } = useSuggestions(searchQueryDeferred)
    const terms = (data?.search.suggestions.terms ?? []).slice(
      0,
      MAX_SUGGESTIONS
    )
    const products = (data?.search.suggestions.products ?? []).slice(
      0,
      MAX_SUGGESTIONS
    )
    const isLoading = !error && !data

    return (
      <UISearchInput
        ref={searchRef}
        visibleDropdown={searchDropdownVisible}
        onSearchSelection={onSearchSelection}
        term={searchQueryDeferred}
        terms={terms}
        products={products}
        isLoading={isLoading}
      >
        <UISearchInputField
          ref={ref}
          buttonProps={{
            onClick: onSearchClick,
            testId: buttonTestId,
          }}
          placeholder={placeholder}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSubmit={(term) => {
            import('src/sdk/search/formatSearchPath').then(
              ({ formatSearchPath }) => {
                const path = formatSearchPath({
                  term,
                  sort: sort as SearchState['sort'],
                })

                onSearchSelection(term, path)
                router.push(path)
              }
            )
          }}
          onFocus={() => setSearchDropdownVisible(true)}
          value={searchQuery}
          {...otherProps}
        />

        {searchDropdownVisible && (
          <Suspense fallback={null}>
            <SearchDropdown
              sort={sort as SearchState['sort']}
              quickOrder={quickOrder}
            />
          </Suspense>
        )}
      </UISearchInput>
    )
  }
)

export default SearchInput
