import { AccordionPanel as UIAccordionPanel } from '@faststore/ui'
import type { ReactNode } from 'react'

interface AccordionPanelProps {
  children: ReactNode
}

function AccordionPanel({ children }: AccordionPanelProps) {
  return (
    <UIAccordionPanel>
      <div data-fs-my-account-accordion-content>{children}</div>
    </UIAccordionPanel>
  )
}

export default AccordionPanel
