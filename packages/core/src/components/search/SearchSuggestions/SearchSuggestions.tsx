import { List as UIList } from '@faststore/ui'
import type { HTMLAttributes } from 'react'
import { Fragment } from 'react'

import SearchProductCard from 'src/components/search/SearchProductCard'
import Icon from 'src/components/ui/Icon'
import Link from 'src/components/ui/Link'
import useSearchInput, { formatSearchPath } from 'src/sdk/search/useSearchInput'
import type { ProductSummary_ProductFragment } from '@generated/graphql'

import styles from '../search.module.scss'

function formatSearchTerm(
  indexSubstring: number,
  searchTerm: string,
  suggestion: string
) {
  if (indexSubstring === 0) {
    return searchTerm
      .split('')
      .map((char, idx) =>
        idx === 0 && suggestion.indexOf(char.toUpperCase()) === 0
          ? char.toUpperCase()
          : char.toLowerCase()
      )
      .join('')
  }

  return searchTerm.toLowerCase()
}

function handleSuggestions(suggestion: string, searchTerm: string) {
  const suggestionSubstring = suggestion
    .toLowerCase()
    .split(searchTerm.toLowerCase())

  return (
    <p>
      {suggestionSubstring.map((substring, indexSubstring) => (
        <Fragment key={[substring, indexSubstring].join()}>
          {substring.length > 0 && (
            <b data-fs-search-item-bold>
              {indexSubstring === 0
                ? substring.charAt(0).toUpperCase() + substring.slice(1)
                : substring}
            </b>
          )}
          {indexSubstring !== suggestionSubstring.length - 1 &&
            formatSearchTerm(indexSubstring, searchTerm, suggestion)}
        </Fragment>
      ))}
    </p>
  )
}

export interface SearchSuggestionsProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Term researched.
   */
  term?: string
  /**
   * Suggestion terms.
   */
  terms?: Array<{ value: string }>
  /**
   * Array with top search terms.
   */
  products?: ProductSummary_ProductFragment[]
}

function SearchSuggestions({
  testId = 'suggestions',
  term = '',
  terms = [],
  products = [],
  ...otherProps
}: SearchSuggestionsProps) {
  const { onSearchInputSelection } = useSearchInput()

  return (
    <section
      data-testid={testId}
      data-fs-search
      className={styles.fsSearch}
      {...otherProps}
    >
      {terms.length > 0 && (
        <UIList data-fs-search-section="terms">
          {terms?.map(({ value: suggestion }) => (
            <li key={suggestion} data-fs-search-item>
              <Link
                data-fs-search-item-link
                href={formatSearchPath(suggestion)}
                onClick={() => {
                  onSearchInputSelection?.(
                    suggestion,
                    formatSearchPath(suggestion)
                  )
                }}
              >
                <Icon
                  name="MagnifyingGlass"
                  width={18}
                  height={18}
                  data-fs-search-item-icon
                />
                {handleSuggestions(suggestion, term)}
              </Link>
            </li>
          ))}
        </UIList>
      )}

      {products.length > 0 && (
        <div data-fs-search-section>
          <div data-fs-search-header>
            <p data-fs-search-title>Suggested Products</p>
          </div>
          <UIList>
            {products.map((product, index) => (
              <li key={product.id} data-fs-search-item>
                <SearchProductCard product={product} index={index} />
              </li>
            ))}
          </UIList>
        </div>
      )}
    </section>
  )
}

export default SearchSuggestions
