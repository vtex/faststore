import {
  Accordion as UIAccordion,
  AccordionButton as UIAccordionButton,
  AccordionItem as UIAccordionItem,
  AccordionPanel as UIAccordionPanel,
  List as UIList,
} from '@faststore/ui'
import { useState } from 'react'

import Link from 'src/components/ui/Link'
import useScreenResize from 'src/sdk/ui/useScreenResize'

type Item = {
  url: string
  text: string
}

type FooterLink = {
  items: Item[]
  sectionTitle: string
}

function Links({ items }: Pick<FooterLink, 'items'>) {
  return (
    <UIList>
      {items.map((item) => (
        <li key={item.text}>
          <Link variant="display" size="small" href={item.url}>
            {item.text}
          </Link>
        </li>
      ))}
    </UIList>
  )
}

export interface FooterLinksProps {
  links: FooterLink[]
}

function FooterLinks({ links }: FooterLinksProps) {
  const { isMobile } = useScreenResize()
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
    <section data-fs-footer data-fs-footer-links>
      {isMobile && (
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
      )}

      {!isMobile && (
        <nav data-fs-footer-links-columns aria-label="Footer Links Navigation">
          {links.map(({ sectionTitle, items }) => (
            <div key={sectionTitle}>
              <p data-fs-footer-links-title>{sectionTitle}</p>
              <Links items={items} />
            </div>
          ))}
        </nav>
      )}
    </section>
  )
}

export default FooterLinks
