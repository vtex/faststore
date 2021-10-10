import type { ButtonHTMLAttributes, ReactNode } from 'react'
import React, { forwardRef } from 'react'

import { Button } from '../..'
import { useAccordion } from './Accordion'
import { useAccordionItem } from './AccordionItem'

export interface AccordionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
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
  const { onSelectPanel, openPanels } = useAccordion()
  const { index, panel, button } = useAccordionItem()

  return (
    <Button
      ref={ref}
      id={button}
      aria-expanded={openPanels.includes(index)}
      aria-controls={panel}
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
