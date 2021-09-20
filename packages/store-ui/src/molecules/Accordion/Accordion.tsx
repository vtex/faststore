import React from 'react'
import { Accordion as ReachAccordion, AccordionProps as ReachAccordionProps } from '@reach/accordion'

export interface AccordionProps extends ReachAccordionProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

function Accordion({
  testId = 'store-accordion',
  children,
  ...props
}: AccordionProps) {
  return (
    <ReachAccordion data-store-accordion data-testid={testId} {...props}>
      {children}
    </ReachAccordion>
  )
}

export default Accordion
