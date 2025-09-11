import { AccordionItem as UIAccordionItem } from '@vtex/faststore-ui'
import type { ReactNode } from 'react'

interface MyAccountAccordionItemProps {
  index: number
  children: ReactNode
}

function MyAccountAccordionItem({
  children,
  index,
  ...props
}: MyAccountAccordionItemProps) {
  return (
    <UIAccordionItem index={index} {...props} data-fs-my-account-accordion-item>
      {children}
    </UIAccordionItem>
  )
}

export default MyAccountAccordionItem
