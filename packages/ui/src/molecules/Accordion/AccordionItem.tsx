import React, { useContext, forwardRef, createContext } from 'react'
import type { ElementType, FC, HTMLAttributes, ReactElement } from 'react'
import type { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../typings'

interface AccordionItemContext {
  index: number
  panel: string
  button: string
  prefixId: string
}

const AccordionItemContext = createContext<AccordionItemContext | undefined>(
  undefined
)

interface Props extends HTMLAttributes<HTMLDivElement> {
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

export type AccordionItemProps<C extends ElementType> = PolymorphicComponentPropsWithRef<
  C,
  Props
>

type AccordionItemComponent = <C extends ElementType = 'div'>(
  props: AccordionItemProps<C>
) => ReactElement | null

const AccordionItem: AccordionItemComponent = forwardRef(
  function AccordionItem<C extends ElementType = 'div'>(
    {
      testId = 'store-accordion-item',
      children,
      prefixId = '',
      index = 0,
      as: MaybeComponent,
      ...otherProps
    }: AccordionItemProps<C>,
    ref: PolymorphicRef<C>
  ) {
    const Component = MaybeComponent ?? 'div'

    const context = {
      index,
      prefixId,
      panel: `${prefixId && `${prefixId}-`}panel--${index}`,
      button: `${prefixId && `${prefixId}-`}button--${index}`,
    }

    return (
      <AccordionItemContext.Provider value={context}>
        <Component ref={ref} data-accordion-item data-testid={testId} {...otherProps}>
          {children}
        </Component>
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

/**
 * This is only being exported to make it easier to use in Storybook.
 * **DON'T** import this directly to use this component, use the default export
 * instead.
 */
export const StorybookAccordionItem = AccordionItem as FC<Props>

export default AccordionItem
