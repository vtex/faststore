import type { HTMLAttributes, ReactElement } from 'react'
import React, { cloneElement, forwardRef, createContext } from 'react'

export interface AccordionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Array of indices that indicate which accordion items are opened
   */
  indices: number[]
  /**
   * Function that is triggered when an accordion item is opened/closed
   */
  onChange: (index: number) => void
}

interface AccordionContext {
  indices: number[]
  onChange: (index: number) => void
}

const AccordionContext = createContext<AccordionContext | undefined>(undefined)

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { testId = 'store-accordion', indices, onChange, children, ...props },
  ref
) {
  const context = { indices, onChange }

  const childrenWithIndex = React.Children.map(
    children as ReactElement,
    (child, index) => cloneElement(child, { index: child.props.index ?? index })
  )

  return (
    <AccordionContext.Provider value={context}>
      <div
        ref={ref}
        data-store-accordion
        data-testid={testId}
        role="region"
        {...props}
      >
        {childrenWithIndex}
      </div>
    </AccordionContext.Provider>
  )
})

export function useAccordion() {
  const context = React.useContext(AccordionContext)

  if (context === undefined) {
    throw new Error(
      'Do not use Accordion components outside the Accordion context.'
    )
  }

  return context
}

export default Accordion
