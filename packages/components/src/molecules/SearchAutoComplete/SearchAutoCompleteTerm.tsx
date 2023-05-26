import type { ReactNode } from 'react'
import React, { Fragment, HTMLAttributes } from 'react'
import { Icon, Link, LinkElementType, LinkProps } from '../..'

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

export interface SearchAutoCompleteTermProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Props for the link from term component.
   */
  linkProps?: Partial<LinkProps<LinkElementType>>
  /**
   * A React component that will be rendered as an icon.
   */
  icon?: ReactNode
  /**
   * Term researched.
   */
  term: string
  /**
   * Suggestion proposed with auto complete.
   */
  suggestion: string
}

const SearchAutoCompleteTerm = ({
  testId = 'fs-search-auto-complete-term',
  suggestion,
  term,
  linkProps,
  icon = <Icon name="MagnifyingGlass" width={18} height={18} />,
}: SearchAutoCompleteTermProps) => {
  const suggestionSubstring = suggestion.toLowerCase().split(term.toLowerCase())

  return (
    <li data-fs-search-auto-complete-item data-testid={testId}>
      <Link
        {...linkProps}
        data-fs-search-auto-complete-item-link
        variant="display"
      >
        <span data-fs-search-auto-complete-item-icon>{icon}</span>
        <p>
          {suggestionSubstring.map((substring, indexSubstring) => (
            <Fragment key={[substring, indexSubstring].join()}>
              {substring.length > 0 && (
                <strong data-fs-search-auto-complete-item-suggestion>
                  {indexSubstring === 0
                    ? substring.charAt(0).toUpperCase() + substring.slice(1)
                    : substring}
                </strong>
              )}
              {indexSubstring !== suggestionSubstring.length - 1 &&
                formatSearchTerm(indexSubstring, term, suggestion)}
            </Fragment>
          ))}
        </p>
      </Link>
    </li>
  )
}

export default SearchAutoCompleteTerm
