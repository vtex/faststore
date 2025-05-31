import type { HTMLAttributes, ReactElement } from 'react'
import React, {
  useContext,
  cloneElement,
  forwardRef,
  createContext,
} from 'react'

interface AccordionContext {
  indices: Set<number>
  onChange: (index: number) => void
  numberOfItems: number
}

const AccordionContext = createContext<AccordionContext | undefined>(undefined)

export interface AccordionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Indices that indicate which accordion items are opened.
   */
  indices: Iterable<number>
  /**
   * Function that is triggered when an accordion item is opened/closed.
   */
  onChange: (index: number) => void
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { testId = 'fs-accordion', indices, onChange, children, ...otherProps },
  ref
) {
  const childrenWithIndex = React.Children.map(
    children as ReactElement,
    (child, index) => cloneElement(child, { index: child.props.index ?? index })
  )

  const context = {
    indices: new Set(indices),
    onChange,
    numberOfItems: childrenWithIndex.length,
  }

  return (
    <AccordionContext.Provider value={context}>
      <div
        ref={ref}
        data-fs-accordion
        role="region"
        data-testid={testId}
        {...otherProps}
      >
        {childrenWithIndex}
      </div>
    </AccordionContext.Provider>
  )
})

export function useAccordion() {
  const context = useContext(AccordionContext)

  if (context === undefined) {
    throw new Error(
      'Do not use Accordion components outside the Accordion context.'
    )
  }

  return context
}

export default Accordion
