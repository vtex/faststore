import { AccordionItem as UIAccordionItem } from '@faststore/ui'
import type { ReactNode } from 'react'

interface AccordionItemProps {
  index: number
  children: ReactNode
}

function AccordionItem({ children, index, ...props }: AccordionItemProps) {
  return (
    <UIAccordionItem index={index} {...props} data-fs-my-account-accordion-item>
      {children}
    </UIAccordionItem>
  )
}

export default AccordionItem
