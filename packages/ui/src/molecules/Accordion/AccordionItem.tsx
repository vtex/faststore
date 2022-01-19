import type { HTMLAttributes } from 'react'
import React, { useContext, forwardRef, createContext } from 'react'

interface AccordionItemContext {
  index: number
  panel: string
  button: string
}

const AccordionItemContext = createContext<AccordionItemContext | undefined>(
  undefined
)

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Index of the current accordion item within the accordion.
   */
  index?: number
  /**
   * Namespace ID prefix for the current Accordion item's panel and button
   * to avoid ID duplication when multiple instances are on the same page.
   */
  prefixId?: string
}

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  function AccordionItem(
    {
      testId = 'store-accordion-item',
      children,
      prefixId = '',
      index = 0,
      ...otherProps
    },
    ref
  ) {
    const context = {
      index,
      panel: `${prefixId && `${prefixId}-`}panel--${index}`,
      button: `${prefixId && `${prefixId}-`}button--${index}`,
    }

    return (
      <AccordionItemContext.Provider value={context}>
        <div ref={ref} data-accordion-item data-testid={testId} {...otherProps}>
          {children}
        </div>
      </AccordionItemContext.Provider>
    )
  }
)

export function useAccordionItem() {
  const context = useContext(AccordionItemContext)

  if (context === undefined) {
    throw new Error(
      'Do not use AccordionItem components outside the AccordionItem context.'
    )
  }

  return context
}

export default AccordionItem
