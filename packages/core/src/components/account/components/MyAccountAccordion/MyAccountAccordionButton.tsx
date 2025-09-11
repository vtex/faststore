import {
  AccordionButton as UIAccordionButton,
  Icon as UIIcon,
} from '@vtex/faststore-ui'
import type { ReactNode } from 'react'

interface MyAccountAccordionButtonProps {
  title: string
  summary: string
  children?: ReactNode
}

function MyAccountAccordionButton({
  title,
  summary,
  children,
}: MyAccountAccordionButtonProps) {
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

export default MyAccountAccordionButton
