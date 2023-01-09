import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

import { useAccordion } from './Accordion'
import { useAccordionItem } from './AccordionItem'

export interface AccordionPanelProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(
  function AccordionPanel(
    { testId = 'fs-accordion-panel', children, ...otherProps },
    ref
  ) {
    const { indices } = useAccordion()
    const { index, button, panel } = useAccordionItem()

    return (
      <div
        ref={ref}
        id={panel}
        data-fs-accordion-panel
        aria-labelledby={button}
        role="region"
        hidden={!indices.has(index)}
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default AccordionPanel
