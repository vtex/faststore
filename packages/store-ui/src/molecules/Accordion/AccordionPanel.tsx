import type { ReactNode } from 'react'
import React, { forwardRef } from 'react'

import { useAccordion } from './Accordion'
import { useAccordionItem } from './AccordionItem'

export interface AccordionPanelProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  children: ReactNode
}

export const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(
  function AccordionPanel(
    { testId = 'store-accordion-panel', children, ...props },
    ref
  ) {
    const { openPanels } = useAccordion()
    const { index, button, panel } = useAccordionItem()

    return (
      <div
        ref={ref}
        id={panel}
        aria-labelledby={button}
        role="region"
        data-store-accordion-panel
        data-testid={testId}
        {...props}
        hidden={!openPanels.includes(index)}
      >
        {children}
      </div>
    )
  }
)
