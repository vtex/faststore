import React from 'react'
import { AccordionPanel as ReachAccordionPanel } from '@reach/accordion'
import type { AccordionPanelProps as ReachAccordionPanelProps } from '@reach/accordion'

export interface AccordionPanelProps extends ReachAccordionPanelProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

export const AccordionPanel = ({
  testId = 'store-accordion-panel',
  children,
  ...props
}: AccordionPanelProps) => {
  return (
    <ReachAccordionPanel
      data-store-accordion-panel
      data-testid={testId}
      {...props}
    >
      {children}
    </ReachAccordionPanel>
  )
}
