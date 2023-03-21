import {
  forwardRef,
  lazy,
  Suspense,
  useRef,
  useState,
  useDeferredValue,
  useImperativeHandle,
} from 'react'
import type { CSSProperties } from 'react'
import { useRouter } from 'next/router'
import { sendAnalyticsEvent } from '@faststore/sdk'
import type { SearchEvent } from '@faststore/sdk'
import {
  SearchInputField as UISearchInputField,
  SearchInput as UISearchInput,
  SearchProviderContextValue,
} from '@faststore/ui'
import type {
  SearchInputFieldProps as UISearchInputFieldProps,
  SearchInputFieldRef as UISearchInputFieldRef,
} from '@faststore/ui'

import useSearchHistory from 'src/sdk/search/useSearchHistory'
import {
  formatSearchPath,
  SearchInputProvider,
} from 'src/sdk/search/useSearchInput'
import type { SearchInputContextValue } from 'src/sdk/search/useSearchInput'
import useOnClickOutside from 'src/sdk/ui/useOnClickOutside'
import useSuggestions from 'src/sdk/search/useSuggestions'

const SearchDropdown = lazy(
  () => import('src/components/search/SearchDropdown')
)

export type SearchInputProps = {
  onSearchClick?: () => void
  buttonTestId?: string
  containerStyle?: CSSProperties
} & Omit<UISearchInputFieldProps, 'onSubmit'>

export type SearchInputRef = UISearchInputFieldRef & {
  resetSearchInput: () => void
}

const sendAnalytics = async (term: string) => {
  sendAnalyticsEvent<SearchEvent>({
    name: 'search',
    params: { search_term: term },
  })
}

const SearchInput = forwardRef<SearchInputRef, SearchInputProps>(
  function SearchInput(
    {
      onSearchClick,
      buttonTestId = 'fs-search-button',
      containerStyle,
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

    const { terms, products, isLoading } = useSuggestions(searchQueryDeferred)

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
          placeholder="Search everything at the store"
          onChange={(e) => setSearchQuery(e.target.value)}
          onSubmit={(term) => {
            const path = formatSearchPath(term)

            onSearchSelection(term, path)
            router.push(path)
          }}
          onFocus={() => setSearchDropdownVisible(true)}
          value={searchQuery}
          {...otherProps}
        />

        {searchDropdownVisible && (
          <Suspense fallback={null}>
            <SearchDropdown />
          </Suspense>
        )}
      </UISearchInput>
    )
  }
)

export default SearchInput
