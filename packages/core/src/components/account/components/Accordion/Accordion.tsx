import { Accordion as UIAccordion, type AccordionProps } from '@faststore/ui'

function Accordion({ children, ...props }: AccordionProps) {
  return (
    <UIAccordion {...props} data-fs-my-account-accordion>
      {children}
    </UIAccordion>
  )
}

export default Accordion
