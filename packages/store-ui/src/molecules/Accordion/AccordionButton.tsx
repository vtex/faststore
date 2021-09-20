import React from 'react'
import {
  AccordionButton as ReachAccordionButton,
  AccordionButtonProps as ReachAccordionButtonProps,
} from '@reach/accordion'

export interface AccordionButtonProps extends ReachAccordionButtonProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

export const AccordionButton = ({
  testId = 'store-accordion-button',
  children,
  ...props
}: AccordionButtonProps) => {
  return (
    <ReachAccordionButton
      data-store-accordion-button
      data-testid={testId}
      {...props}
    >
      {children}
    </ReachAccordionButton>
  )
}
