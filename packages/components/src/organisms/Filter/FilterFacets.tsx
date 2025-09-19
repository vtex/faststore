import type { PropsWithChildren } from 'react'
import { AccordionButton, AccordionItem, AccordionPanel } from '../..'

export interface FilterFacetsProps {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
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
  /**
   * The description displayed to identify the Facet.
   */
  description?: string
}

export default function FilterFacets({
  testId,
  label,
  index,
  children,
  type,
  description,
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
      <AccordionPanel>
        {description && (
          <span data-fs-filter-accordion-item-description>{description}</span>
        )}
        {children}
      </AccordionPanel>
    </AccordionItem>
  )
}
