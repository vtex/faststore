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
import { SearchInputField as UISearchInputField } from '@faststore/ui'
import type {
  SearchInputFieldProps as UISearchInputFieldProps,
  SearchInputFieldRef as UISearchInputFieldRef,
} from '@faststore/ui'

import Icon from 'src/components/ui/Icon'
import useSearchHistory from 'src/sdk/search/useSearchHistory'
import {
  formatSearchPath,
  SearchInputProvider,
} from 'src/sdk/search/useSearchInput'
import type { SearchInputContextValue } from 'src/sdk/search/useSearchInput'
import useOnClickOutside from 'src/sdk/ui/useOnClickOutside'

import inputStyles from './search-input.module.scss'
import styles from '../search.module.scss'

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
      buttonTestId = 'store-search-button',
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

    const onSearchInputSelection: SearchInputContextValue['onSearchInputSelection'] =
      (term, path) => {
        addToSearchHistory({ term, path })
        sendAnalytics(term)
        setSearchDropdownVisible(false)
        setSearchQuery(term)
      }

    useOnClickOutside(searchRef, () => setSearchDropdownVisible(false))

    return (
      <div
        ref={searchRef}
        data-fs-search-input-wrapper
        // className={styles.fsSearchInput}
        data-fs-search-input-dropdown-visible={searchDropdownVisible}
        // style={containerStyle}
      >
        <SearchInputProvider onSearchInputSelection={onSearchInputSelection}>
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

              onSearchInputSelection(term, path)
              router.push(path)
            }}
            onFocus={() => setSearchDropdownVisible(true)}
            value={searchQuery}
            {...otherProps}
          />

          {searchDropdownVisible && (
            <Suspense fallback={null}>
              <SearchDropdown term={searchQueryDeferred} />
            </Suspense>
          )}
        </SearchInputProvider>
      </div>
    )
  }
)

export default SearchInput
