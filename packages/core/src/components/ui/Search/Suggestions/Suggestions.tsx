import { List as UIList } from '@faststore/ui'
import type { HTMLAttributes } from 'react'

import SuggestionProductCard from 'src/components/search/SuggestionProductCard'
import Button from 'src/components/ui/Button'
import type { ProductSummary_ProductFragment } from '@generated/graphql'

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
        <>
          {substring.length > 0 && (
            <b data-fs-search-suggestion-item-bold>
              {indexSubstring === 0
                ? substring.charAt(0).toUpperCase() + substring.slice(1)
                : substring}
            </b>
          )}
          {indexSubstring !== suggestionSubstring.length - 1 &&
            formatSearchTerm(indexSubstring, searchTerm, suggestion)}
        </>
      ))}
    </p>
  )
}

export interface SuggestionsProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Search term
   */
  term?: string
  /**
   * Callback to be executed when a suggestion is selected.
   *
   * @memberof SuggestionsProps
   */
  onSearch: (term: string) => void
  terms?: Array<{ value: string }>
  products?: ProductSummary_ProductFragment[]
}

function Suggestions({
  testId = 'suggestions',
  term = '',
  terms = [],
  products = [],
  onSearch,
  ...otherProps
}: SuggestionsProps) {
  return (
    <section data-testid={testId} data-fs-search-suggestions {...otherProps}>
      {terms.length > 0 && (
        <UIList data-fs-search-suggestion-section>
          {terms?.map(({ value: suggestion }) => (
            <li key={suggestion} data-fs-search-suggestion-item>
              <Button onClick={() => onSearch(suggestion)}>
                {handleSuggestions(suggestion, term)}
              </Button>
            </li>
          ))}
        </UIList>
      )}

      {products.length > 0 && (
        <div data-fs-search-suggestion-section>
          <p data-fs-search-suggestion-title="small">Suggested Products</p>
          <UIList>
            {products.map((product, index) => (
              <li key={product.id} data-fs-search-suggestion-item>
                <SuggestionProductCard product={product} index={index} />
              </li>
            ))}
          </UIList>
        </div>
      )}
    </section>
  )
}

export default Suggestions
