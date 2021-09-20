import React from 'react'
import { AccordionItem as ReachAccordionItem } from '@reach/accordion'
import type { AccordionItemProps as ReachAccordionItemProps } from '@reach/accordion'

export interface AccordionItemProps extends ReachAccordionItemProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

export function AccordionItem({
  testId = 'store-accordion',
  children,
  ...props
}: AccordionItemProps) {
  return (
    <ReachAccordionItem data-store-accordion data-testid={testId} {...props}>
      {children}
    </ReachAccordionItem>
  )
}
