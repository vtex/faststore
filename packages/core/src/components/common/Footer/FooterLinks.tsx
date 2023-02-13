import { useState } from 'react'
import {
  List as UIList,
  Accordion as UIAccordion,
  AccordionItem as UIAccordionItem,
  AccordionButton as UIAccordionButton,
  AccordionPanel as UIAccordionPanel,
} from '@faststore/ui'

import Link from 'src/components/ui/Link'

import styles from './footer.module.scss'

const links = [
  {
    title: 'Our company',
    items: [
      {
        href: '/',
        name: 'About Us',
      },
      {
        href: '/',
        name: 'Our Blog',
      },
      {
        href: '/',
        name: 'Stores',
      },
      {
        href: '/',
        name: 'Work With Us',
      },
    ],
  },
  {
    title: 'Orders & Purchases',
    items: [
      {
        href: '/',
        name: 'Check Order Status',
      },
      {
        href: '/',
        name: 'Returns and Exchanges',
      },
      {
        href: '/',
        name: 'Product Recall',
      },
      {
        href: '/',
        name: 'Gift Cards',
      },
    ],
  },
  {
    title: 'Support & Services',
    items: [
      {
        href: '/',
        name: 'Support Center',
      },
      {
        href: '/',
        name: 'Schedule a Service',
      },
      {
        href: '/',
        name: 'Contact Us',
      },
    ],
  },
  {
    title: 'Partnerships',
    items: [
      {
        href: '/',
        name: 'Affiliate Program',
      },
      {
        href: '/',
        name: 'Advertise with US',
      },
      {
        href: '/',
        name: 'Market Place',
      },
    ],
  },
]

type LinkItem = {
  href: string
  name: string
}

interface LinksListProps {
  items: LinkItem[]
}

function LinksList({ items }: LinksListProps) {
  return (
    <UIList>
      {items.map((item) => (
        <li key={item.name}>
          <Link variant="display" size="small" href={item.href}>
            {item.name}
          </Link>
        </li>
      ))}
    </UIList>
  )
}

function FooterLinks() {
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
    <section className={styles.fsFooter} data-fs-footer-links>
      <div className="display-mobile">
        <UIAccordion indices={indicesExpanded} onChange={onChange}>
          {links.map((section) => (
            <UIAccordionItem key={section.title}>
              <UIAccordionButton>{section.title}</UIAccordionButton>
              <UIAccordionPanel>
                <LinksList items={section.items} />
              </UIAccordionPanel>
            </UIAccordionItem>
          ))}
        </UIAccordion>
      </div>

      <div className="hidden-mobile">
        <nav data-fs-footer-links-columns>
          {links.map((section) => (
            <div key={section.title}>
              <p data-fs-footer-title>{section.title}</p>
              <LinksList items={section.items} />
            </div>
          ))}
        </nav>
      </div>
    </section>
  )
}

export default FooterLinks
