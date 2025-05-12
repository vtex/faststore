import { AccordionPanel as UIAccordionPanel } from '@faststore/ui'
import type { ReactNode } from 'react'

interface MyAccountAccordionPanelProps {
  children: ReactNode
}

function MyAccountAccordionPanel({ children }: MyAccountAccordionPanelProps) {
  return (
    <UIAccordionPanel>
      <div data-fs-my-account-accordion-content>{children}</div>
    </UIAccordionPanel>
  )
}

export default MyAccountAccordionPanel
