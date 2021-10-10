import type { HTMLAttributes } from 'react'
import React, { forwardRef, createContext } from 'react'

export interface AccordionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  indices: number[]
  onChange: (index: number) => void
}

interface AccordionContext {
  openPanels: number[]
  onSelectPanel: (index: number) => void
}

const AccordionContext = createContext<AccordionContext | undefined>(undefined)

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { testId = 'store-accordion', indices, onChange, children, ...props },
  ref
) {
  const context = {
    openPanels: indices,
    onSelectPanel: onChange,
  }

  return (
    <AccordionContext.Provider value={context}>
      <div
        ref={ref}
        data-store-accordion
        data-testid={testId}
        role="region"
        {...props}
      >
        {children}
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
