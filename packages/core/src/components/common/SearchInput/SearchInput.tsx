import { sendAnalyticsEvent } from '@faststore/sdk'
import { SearchInput as UISearchInput } from '@faststore/ui'
import { useRouter } from 'next/router'
import {
  forwardRef,
  lazy,
  Suspense,
  useRef,
  useState,
  useDeferredValue,
} from 'react'
import type { SearchEvent } from '@faststore/sdk'
import type {
  SearchInputProps as UISearchInputProps,
  SearchInputRef,
} from '@faststore/ui'

import Icon from 'src/components/ui/Icon'
import useSearchHistory from 'src/sdk/search/useSearchHistory'
import {
  formatSearchPath,
  SearchInputProvider,
} from 'src/sdk/search/useSearchInput'
import type { SearchInputContextValue } from 'src/sdk/search/useSearchInput'
import useOnClickOutside from 'src/sdk/ui/useOnClickOutside'

const Suggestions = lazy(() => import('src/components/search/Suggestions'))

declare type SearchInputProps = {
  onSearchClick?: () => void
  buttonTestId?: string
} & Omit<UISearchInputProps, 'onSubmit'>

const sendAnalytics = async (term: string) => {
  sendAnalyticsEvent<SearchEvent>({
    name: 'search',
    params: { search_term: term },
  })
}

const SearchInput = forwardRef<SearchInputRef, SearchInputProps>(
  function SearchInput(
    { onSearchClick, buttonTestId = 'store-search-button', ...props },
    ref
  ) {
    const [searchQuery, setSearchQuery] = useState<string>('')
    const searchQueryDeferred = useDeferredValue(searchQuery)
    const [suggestionsOpen, setSuggestionsOpen] = useState<boolean>(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const { addToSearchHistory } = useSearchHistory()
    const router = useRouter()

    const onSearchInputSelection: SearchInputContextValue['onSearchInputSelection'] =
      (term, path) => {
        addToSearchHistory({ term, path })
        sendAnalytics(term)
        setSuggestionsOpen(false)
        setSearchQuery(term)
      }

    useOnClickOutside(searchRef, () => setSuggestionsOpen(false))

    return (
      <div
        ref={searchRef}
        data-store-search-input-wrapper
        data-store-search-input-dropdown-open={suggestionsOpen}
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
            onFocus={() => setSuggestionsOpen(true)}
            value={searchQuery}
            {...props}
          />
          {suggestionsOpen && (
            <Suspense fallback={null}>
              <div data-store-search-input-dropdown-wrapper>
                <Suggestions term={searchQueryDeferred} />
              </div>
            </Suspense>
          )}
        </SearchInputProvider>
      </div>
    )
  }
)

export default SearchInput
