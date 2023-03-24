import React from 'react'
import { Accordion as UIAccordion } from '../../'

import { PropsWithChildren } from 'react'

export type OnFacetChange = (
  item: { key: string; value: string },
  type: 'BOOLEAN' | 'RANGE'
) => void

export interface FilterProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId: string
  /**
   * Title for the `Filter` component.
   */
  title?: string
  /**
   * The expanded items from the `Accordion`.
   */
  indicesExpanded: Set<number>
  /**
   * This function is called when `Accordion` is expanded or collapsed.
   */
  onAccordionChange: (index: number) => void
}

function Filter({
  testId,
  title,
  indicesExpanded,
  onAccordionChange,
  children,
}: PropsWithChildren<FilterProps>) {
  return (
    <div data-fs-filter data-testid={testId}>
      <h2 className="text__title-mini-alt" data-fs-filter-title>
        {title}
      </h2>
      <UIAccordion
        indices={indicesExpanded}
        onChange={onAccordionChange}
        data-fs-filter-accordion
      >
        {children}
      </UIAccordion>
    </div>
  )
}

export default Filter
