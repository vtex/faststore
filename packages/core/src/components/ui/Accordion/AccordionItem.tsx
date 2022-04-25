import { forwardRef } from 'react'
import {
  Icon as UIIcon,
  AccordionItem as UIAccordionItem,
  AccordionPanel as UIAccordionPanel,
  AccordionButton as UIAccordionButton,
} from '@faststore/ui'
import type { AccordionItemProps } from '@faststore/ui'

import Icon from 'src/components/ui/Icon'

interface Props extends AccordionItemProps {
  /**
   * Attribute to check whether the item is expanded or not.
   */
  isExpanded: boolean
  /**
   * Label for Accordion button
   */
  buttonLabel?: string
}

const AccordionItem = forwardRef<HTMLDivElement, Props>(function AccordionItem(
  {
    children,
    isExpanded,
    index = 0,
    buttonLabel = '',
    testId = 'store-accordion-item',
    ...otherProps
  },
  ref
) {
  return (
    <UIAccordionItem
      ref={ref}
      index={index}
      data-testid={`${testId}-item`}
      {...otherProps}
    >
      <UIAccordionButton
        className="text__title-subsection"
        data-testid={`${testId}-button`}
      >
        {buttonLabel}
        <UIIcon
          data-testid={`${testId}-button-icon`}
          component={
            <>
              <Icon
                data-icon={isExpanded ? 'expanded' : true}
                name="MinusCircle"
                width={24}
                height={24}
              />
              <Icon
                data-icon={isExpanded ? true : 'collapsed'}
                name="PlusCircle"
                width={24}
                height={24}
              />
            </>
          }
        />
      </UIAccordionButton>
      <UIAccordionPanel data-testid={`${testId}-panel`}>
        {children}
      </UIAccordionPanel>
    </UIAccordionItem>
  )
})

export default AccordionItem
