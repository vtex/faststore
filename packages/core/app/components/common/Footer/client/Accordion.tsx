'use client'

import {
  Accordion as UIAccordion,
  AccordionButton as UIAccordionButton,
  AccordionItem as UIAccordionItem,
  AccordionPanel as UIAccordionPanel,
} from '@faststore/ui'
import { useState } from 'react'
import { FooterLinksProps, Links } from '../FooterLinks'

function Accordion({ links }: FooterLinksProps) {
  console.log('🚀 ~ Accordion:')
  const [indicesExpanded, setIndicesExpanded] = useState<Set<number>>(
    new Set([])
  )

  const onChange = (index: number) => {
    if (indicesExpanded.has(index)) {
      indicesExpanded.delete(index)
      setIndicesExpanded(new Set(indicesExpanded))
    } else {
      setIndicesExpanded(new Set(indicesExpanded.add(index)))
    }
  }

  return (
    <UIAccordion indices={indicesExpanded} onChange={onChange}>
      {links.map(({ sectionTitle, items }) => (
        <UIAccordionItem key={sectionTitle}>
          <UIAccordionButton>{sectionTitle}</UIAccordionButton>
          <UIAccordionPanel>
            <Links items={items} />
          </UIAccordionPanel>
        </UIAccordionItem>
      ))}
    </UIAccordion>
  )
}

export default Accordion
