import { Accordion as UIAccordion, type AccordionProps } from '@faststore/ui'

interface MyAccountAccordionProps extends AccordionProps {}

function MyAccountAccordion({ children, ...props }: MyAccountAccordionProps) {
  return (
    <UIAccordion {...props} data-fs-my-account-accordion>
      {children}
    </UIAccordion>
  )
}

export default MyAccountAccordion
