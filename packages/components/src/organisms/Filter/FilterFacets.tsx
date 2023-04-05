import React, { PropsWithChildren } from 'react'
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
  label: string
}

function FilterFacets({
  testId,
  label,
  index,
  children,
  type,
}: PropsWithChildren<FilterFacetsProps>) {
  return (
    <AccordionItem
      key={`${label}-${index}`}
      prefixId={testId}
      testId={`${testId}-accordion`}
      index={index}
      data-type={type}
      data-fs-filter-accordion-item
    >
      <AccordionButton testId={`${testId}-accordion-button`}>
        {label}
      </AccordionButton>
      <AccordionPanel>{children}</AccordionPanel>
    </AccordionItem>
  )
}

export default FilterFacets
