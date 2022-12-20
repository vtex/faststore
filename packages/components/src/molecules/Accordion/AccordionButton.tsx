import React, { forwardRef } from 'react'

import { useAccordion } from './Accordion'
import { useAccordionItem } from './AccordionItem'

import { Button, MinusCircle, PlusCircle } from '../..'
import type { ButtonProps } from '../..'

export interface AccordionButtonProps extends ButtonProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const AccordionButton = forwardRef<HTMLButtonElement, AccordionButtonProps>(
  function AccordionButton(
    { testId = 'fs-accordion-button', children, ...otherProps },
    ref
  ) {
    const { indices, onChange, numberOfItems } = useAccordion()
    const { index, panel, button, prefixId } = useAccordionItem()

    const onKeyDown = (event: React.KeyboardEvent) => {
      if (!['ArrowDown', 'ArrowUp'].includes(event.key)) {
        return
      }

      const getNext = () => {
        const next = Number(index) + 1 === numberOfItems ? 0 : Number(index) + 1

        return document.getElementById(
          `${prefixId && `${prefixId}-`}button--${next}`
        )
      }

      const getPrevious = () => {
        const previous =
          Number(index) - 1 < 0 ? numberOfItems - 1 : Number(index) - 1

        return document.getElementById(
          `${prefixId && `${prefixId}-`}button--${previous}`
        )
      }

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          getNext()?.focus()
          break

        case 'ArrowUp':
          event.preventDefault()
          getPrevious()?.focus()
          break

        default:
      }
    }

    return (
      <Button
        ref={ref}
        id={button}
        aria-expanded={indices.has(index)}
        aria-controls={panel}
        data-fs-accordion-button
        onKeyDown={onKeyDown}
        onClick={() => {
          onChange(index)
        }}
        icon={
          indices.has(index) ? (
            <MinusCircle data-icon="expanded" />
          ) : (
            <PlusCircle data-icon="collapsed" />
          )
        }
        iconPosition="right"
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </Button>
    )
  }
)

export default AccordionButton
