import { List as UIList } from '@faststore/ui'

import Link from 'app/components/ui/Link'
import Accordion from './client/Accordion'

export type Item = {
  url: string
  text: string
}

export type FooterLink = {
  items: Item[]
  sectionTitle: string
}

export function Links({ items }: Pick<FooterLink, 'items'>) {
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
  console.log('🚀 ~ FooterLinks:')
  return (
    <section data-fs-footer data-fs-footer-links>
      <div className="display-mobile">
        <Accordion links={links}></Accordion>
      </div>

      <div className="hidden-mobile">
        <nav data-fs-footer-links-columns>
          {links.map(({ sectionTitle, items }) => (
            <div key={sectionTitle}>
              <p data-fs-footer-links-title>{sectionTitle}</p>
              <Links items={items} />
            </div>
          ))}
        </nav>
      </div>
    </section>
  )
}

export default FooterLinks
