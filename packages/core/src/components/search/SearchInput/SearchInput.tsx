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

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import type { SearchEvent, SearchState } from '@faststore/sdk'

import type {
  SearchInputFieldProps as UISearchInputFieldProps,
  SearchInputFieldRef as UISearchInputFieldRef,
  SearchInputProps as UISearchInputProps,
} from '@faststore/ui'
import { SearchProviderContextValue } from '@faststore/ui'

import useSearchHistory from 'src/sdk/search/useSearchHistory'
import useSuggestions from 'src/sdk/search/useSuggestions'
import useOnClickOutside from 'src/sdk/ui/useOnClickOutside'

const SearchDropdown = lazy(
  /* webpackChunkName: "SearchDropdown" */
  () => import('src/components/search/SearchDropdown')
)

const UISearchInput = dynamic<UISearchInputProps & any>(() =>
  /* webpackChunkName: "UISearchInput" */
  import('@faststore/ui').then((module) => module.SearchInput)
)
const UISearchInputField = dynamic<UISearchInputFieldProps & any>(() =>
  /* webpackChunkName: "UISearchInputField" */
  import('@faststore/ui').then((module) => module.SearchInputField)
)

const MAX_SUGGESTIONS = 5

export type SearchInputProps = {
  onSearchClick?: () => void
  buttonTestId?: string
  containerStyle?: CSSProperties
  placeholder?: string
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
            <SearchDropdown sort={sort as SearchState['sort']} />
          </Suspense>
        )}
      </UISearchInput>
    )
  }
)

export default SearchInput
