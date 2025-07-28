import React, { type PropsWithChildren } from 'react'
import { AccordionButton, AccordionItem, AccordionPanel } from '../..'

export interface FilterFacetsProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId: string
  /**
   * Current Facet's position in a list of facets.
   */
  index: number
  /**
   * Current Facet's type, usually `StoreFacetBoolean` or `StoreFacetRange`.
   */
  type: string
  /**
   * The text displayed to identify the Facet.
   */
  label?: string
  /**
   * The description displayed to identify the Facet.
   */
  description?: string
  /**
   * Defines if the facet should be highlighted, it will not be displayed as an accordion button and will be expanded (not collapsible).
   */
  highlighted?: boolean
}

function FilterFacets({
  testId,
  label,
  index,
  children,
  type,
  description,
  highlighted,
}: PropsWithChildren<FilterFacetsProps>) {
  return (
    <AccordionItem
      key={`${label}-${index}`}
      prefixId={testId}
      testId={`${testId}-accordion`}
      index={index}
      data-type={type}
      data-fs-filter-accordion-item
      data-fs-filter-accordion-item-highlighted={highlighted}
    >
      {highlighted ? (
        <>{children}</>
      ) : (
        <>
          <AccordionButton testId={`${testId}-accordion-button`}>
            {label}
          </AccordionButton>
          <AccordionPanel>
            {description && (
              <span data-fs-filter-accordion-item-description>
                {description}
              </span>
            )}
            {children}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  )
}

export default FilterFacets
