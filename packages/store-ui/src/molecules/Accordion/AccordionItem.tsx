import type { ReactNode } from 'react'
import React, { forwardRef, createContext } from 'react'

export interface AccordionItemProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  children: ReactNode
  index: number
}

interface AccordionItemContext {
  index: number
  panel: string
  button: string
}

const AccordionItemContext = createContext<AccordionItemContext | undefined>(
  undefined
)

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  function AccordionItem(
    { testId = 'store-accordion-item', children, index, ...props },
    ref
  ) {
    const context = {
      index,
      panel: `panel--${index}`,
      button: `button--${index}`,
    }

    return (
      <AccordionItemContext.Provider value={context}>
        <div
          ref={ref}
          data-store-accordion-item
          data-testid={testId}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    )
  }
)

export function useAccordionItem() {
  const context = React.useContext(AccordionItemContext)

  if (context === undefined) {
    throw new Error(
      'Do not use AccordionItem components outside the AccordionItem context.'
    )
  }

  return context
}
