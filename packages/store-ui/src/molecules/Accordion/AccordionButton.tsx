import type { ReactNode } from 'react'
import React, { forwardRef } from 'react'

import { Button } from '../..'
import { useAccordion } from './Accordion'
import { useAccordionItem } from './AccordionItem'

export interface AccordionButtonProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  children: ReactNode
}

export const AccordionButton = forwardRef<
  HTMLButtonElement,
  AccordionButtonProps
>(function AccordionButton(
  { testId = 'store-accordion-button', children, ...props },
  ref
) {
  const { onSelectPanel } = useAccordion()
  const { index } = useAccordionItem()

  return (
    <Button
      ref={ref}
      data-store-accordion-button
      data-testid={testId}
      onClick={() => {
        onSelectPanel(index)
      }}
      {...props}
    >
      {children}
    </Button>
  )
})
