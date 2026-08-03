import {
  AccordionButton as UIAccordionButton,
  Icon as UIIcon,
} from '@faststore/ui'
import type { ReactNode } from 'react'

interface AccordionButtonProps {
  title: string
  summary: string
  children?: ReactNode
}

function AccordionButton({ title, summary, children }: AccordionButtonProps) {
  return (
    <UIAccordionButton
      collapsedIcon={<UIIcon name="CaretDown" />}
      expandedIcon={<UIIcon name="CaretUp" />}
      data-fs-my-account-accordion-button
      type="button"
    >
      <div data-fs-my-account-accordion-header>
        <UIIcon name="Package" />
        <span data-fs-my-account-accordion-header-title>{title}</span>
      </div>
      <p data-fs-my-account-accordion-summary>{summary}</p>
      {children}
    </UIAccordionButton>
  )
}

export default AccordionButton
