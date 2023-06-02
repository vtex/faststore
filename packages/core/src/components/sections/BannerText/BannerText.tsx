import {
  BannerProps as UIBannerProps,
  BannerContentProps as UIBannerContentProps,
} from '@faststore/ui'
import { Components, Props } from './Overrides'

import Section from '../Section'
import styles from './section.module.scss'

export interface BannerTextProps {
  title: UIBannerContentProps['title']
  caption: UIBannerContentProps['caption']
  link?: {
    text?: string
    url?: string
  }
  colorVariant?: UIBannerProps['colorVariant']
  variant?: UIBannerProps['variant']
}

const { Banner, BannerContent } = Components

// TODO: Change actionPath and actionLabel with Link
function BannerText({
  title,
  caption,
  link,
  variant = Props['BannerText'].variant ?? 'primary',
  colorVariant = Props['BannerText'].colorVariant ?? 'main',
}: BannerTextProps) {
  return (
    <Section className={`${styles.section} section-banner layout__section`}>
      <div className="layout__content">
        <Banner
          variant={variant}
          colorVariant={colorVariant}
          {...Props['Banner']}
        >
          <BannerContent
            title={title}
            caption={caption}
            link={link?.url}
            linkText={link?.text}
            {...Props['BannerContent']}
          />
        </Banner>
      </div>
    </Section>
  )
}

export default BannerText
