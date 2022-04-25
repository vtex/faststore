import { List as UIList } from '@faststore/ui'
import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

import Button from 'src/components/ui/Button'
import Link from 'src/components/ui/Link'

import SuggestionProductCard from '../SuggestionProductCard'

const MAX_SUGGESTIONS = 10
const MAX_SUGGESTIONS_WITH_PRODUCTS = 5
const MAX_SUGGESTED_PRODUCTS = 4
const SUGGESTED_PRODUCTS = [
  {
    name: 'Ergonomic Wooden Bacon',
    listPrice: 72.06,
    price: 46.26,
    image: [
      {
        alternateName: 'rerum',
        url: 'http://storeframework.vtexassets.com/arquivos/ids/167285/ut.jpg?v=637753017045600000',
      },
    ],
  },
  {
    name: 'Handcrafted Rubber Sausages',
    listPrice: 59.57,
    price: 32.83,
    image: [
      {
        alternateName: 'ea',
        url: 'http://storeframework.vtexassets.com/arquivos/ids/155949/voluptas.jpg?v=637752878341070000',
      },
    ],
  },
]

const SUGGESTIONS = ['Sony MX', 'Sony MV-100 Headphone', 'Sony M2000 Earbuds']

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
            <b className="suggestions__item-bold">
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
}

const Suggestions = forwardRef<HTMLDivElement, SuggestionsProps>(
  function Suggestions(
    { testId = 'suggestions', term = '', ...otherProps },
    ref
  ) {
    const suggestions =
      SUGGESTED_PRODUCTS.length > 0
        ? SUGGESTIONS.slice(0, MAX_SUGGESTIONS_WITH_PRODUCTS)
        : SUGGESTIONS.slice(0, MAX_SUGGESTIONS)

    return (
      <section
        ref={ref}
        data-testid={testId}
        data-store-suggestions
        className="suggestions"
        {...otherProps}
      >
        {suggestions.length > 0 && (
          <UIList data-suggestions-list className="suggestions__section">
            {suggestions?.map((suggestion, index) => (
              <li key={index} className="suggestions__item">
                <Button onClick={() => null}>
                  {handleSuggestions(suggestion, term)}
                </Button>
              </li>
            ))}
          </UIList>
        )}

        {SUGGESTED_PRODUCTS.length > 0 && (
          <div className="suggestions__section">
            <p className="suggestions__title">Suggested Products</p>
            <UIList>
              {SUGGESTED_PRODUCTS.slice(0, MAX_SUGGESTED_PRODUCTS).map(
                (product, index) => (
                  <li key={index} className="suggestions__item">
                    <Link href="/" variant="display">
                      <SuggestionProductCard product={product} />
                    </Link>
                  </li>
                )
              )}
            </UIList>
          </div>
        )}
      </section>
    )
  }
)

export default Suggestions
