import {
  BannerTextProps as UIBannerTextProps,
  BannerTextContentProps as UIBannerTextContentProps,
} from '@faststore/ui'
import { Components, Props } from './Overrides'

import Section from '../Section'
import styles from './section.module.scss'

export interface BannerTextProps {
  title: UIBannerTextContentProps['title']
  caption: UIBannerTextContentProps['caption']
  link?: {
    text?: string
    url?: string
  }
  colorVariant?: UIBannerTextProps['colorVariant']
  variant?: UIBannerTextProps['variant']
}

const { Banner, BannerContent } = Components

// TODO: Change actionPath and actionLabel with Link
function BannerText({
  title,
  caption,
  link: {
    url: linkUrl = Props['BannerContent'].link,
    text: linkText = Props['BannerContent'].linkText,
  },
  variant = Props['Banner'].variant ?? 'primary',
  colorVariant = Props['Banner'].colorVariant ?? 'main',
}: BannerTextProps) {
  return (
    <Section className={`${styles.section} section-banner layout__section`}>
      <Banner
        {...Props['Banner']}
        variant={variant}
        colorVariant={colorVariant}
      >
        <BannerContent
          {...Props['BannerContent']}
          title={title}
          caption={caption}
          link={linkUrl}
          linkText={linkText}
        />
      </Banner>
    </Section>
  )
}

export default BannerText
