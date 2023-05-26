import type { ReactNode } from 'react'
import React, { forwardRef } from 'react'

import { useAccordion } from './Accordion'
import { useAccordionItem } from './AccordionItem'

import type { ButtonProps } from '../..'
import { Button, Icon } from '../..'

export interface AccordionButtonProps extends ButtonProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * A React component is rendered as an icon when the accordion is expanded.
   */
  expandedIcon?: ReactNode
  /**
   * A React component is rendered as an icon when the accordion is collapsed.
   */
  collapsedIcon?: ReactNode
}

const AccordionButton = forwardRef<HTMLButtonElement, AccordionButtonProps>(
  function AccordionButton(
    {
      testId = 'fs-accordion-button',
      expandedIcon = <Icon name="MinusCircle" data-icon="expanded" />,
      collapsedIcon = <Icon name="PlusCircle" data-icon="collapsed" />,
      children,
      ...otherProps
    },
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
        variant="tertiary"
        data-fs-accordion-button
        aria-expanded={indices.has(index)}
        icon={indices.has(index) ? expandedIcon : collapsedIcon}
        iconPosition="right"
        aria-controls={panel}
        onKeyDown={onKeyDown}
        onClick={() => {
          onChange(index)
        }}
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </Button>
    )
  }
)

export default AccordionButton
