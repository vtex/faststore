import { sendAnalyticsEvent } from '@faststore/sdk'
import { SearchInput as UISearchInput } from '@faststore/ui'
import { useRouter } from 'next/router'
import type { CSSProperties } from 'react'
import {
  forwardRef,
  lazy,
  Suspense,
  useRef,
  useState,
  useDeferredValue,
  useImperativeHandle,
} from 'react'
import type { SearchEvent } from '@faststore/sdk'
import type {
  SearchInputProps as UISearchInputProps,
  SearchInputRef as UISearchInputRef,
} from '@faststore/ui'

import Icon from 'src/components/ui/Icon'
import useSearchHistory from 'src/sdk/search/useSearchHistory'
import {
  formatSearchPath,
  SearchInputProvider,
} from 'src/sdk/search/useSearchInput'
import type { SearchInputContextValue } from 'src/sdk/search/useSearchInput'
import useOnClickOutside from 'src/sdk/ui/useOnClickOutside'

const SearchDropdown = lazy(
  () => import('src/components/search/SearchDropdown')
)

export type SearchInputProps = {
  onSearchClick?: () => void
  buttonTestId?: string
  containerStyle?: CSSProperties
} & Omit<UISearchInputProps, 'onSubmit'>

export type SearchInputRef = UISearchInputRef & { resetSearchInput: () => void }

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
      buttonTestId = 'store-search-button',
      containerStyle,
      ...otherProps
    },
    ref
  ) {
    const [searchQuery, setSearchQuery] = useState<string>('')
    const searchQueryDeferred = useDeferredValue(searchQuery)
    const [searchDropdownOpen, setSearchDropdownOpen] = useState<boolean>(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const { addToSearchHistory } = useSearchHistory()
    const router = useRouter()

    useImperativeHandle(ref, () => ({
      resetSearchInput: () => setSearchQuery(''),
    }))

    const onSearchInputSelection: SearchInputContextValue['onSearchInputSelection'] =
      (term, path) => {
        addToSearchHistory({ term, path })
        sendAnalytics(term)
        setSearchDropdownOpen(false)
        setSearchQuery(term)
      }

    useOnClickOutside(searchRef, () => setSearchDropdownOpen(false))

    return (
      <div
        ref={searchRef}
        data-store-search-input-wrapper
        data-store-search-input-dropdown-open={searchDropdownOpen}
        style={containerStyle}
      >
        <SearchInputProvider onSearchInputSelection={onSearchInputSelection}>
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
            onChange={(e) => setSearchQuery(e.target.value)}
            onSubmit={(term) => {
              const path = formatSearchPath(term)

              onSearchInputSelection(term, path)
              router.push(path)
            }}
            onFocus={() => setSearchDropdownOpen(true)}
            value={searchQuery}
            {...otherProps}
          />
          {searchDropdownOpen && (
            <Suspense fallback={null}>
              <div data-store-search-input-dropdown-wrapper>
                <SearchDropdown term={searchQueryDeferred} />
              </div>
            </Suspense>
          )}
        </SearchInputProvider>
      </div>
    )
  }
)

export default SearchInput
