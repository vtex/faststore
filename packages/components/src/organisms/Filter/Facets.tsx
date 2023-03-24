import React, { PropsWithChildren } from 'react'
import { AccordionButton, AccordionItem, AccordionPanel } from '../..'

export type FacetsProps = {
  index: number
  testId: string
  type: string
  label: string
}

function Facets({
  label,
  index,
  testId,
  children,
  type,
}: PropsWithChildren<FacetsProps>) {
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

export default Facets
