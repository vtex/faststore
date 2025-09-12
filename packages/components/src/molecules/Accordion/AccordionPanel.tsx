import type { ComponentProps } from 'react'
import React from 'react'

import { useAccordion } from './Accordion'
import { useAccordionItem } from './AccordionItem'

export interface AccordionPanelProps
  extends Omit<ComponentProps<'div'>, 'role'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
}

export default function AccordionPanel({
  testId = 'fs-accordion-panel',
  children,
  ref,
  ...otherProps
}: AccordionPanelProps) {
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
