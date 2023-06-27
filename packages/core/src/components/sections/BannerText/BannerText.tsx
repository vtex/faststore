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

const { BannerText: BannerTextWrapper, BannerTextContent } = Components

// TODO: Change actionPath and actionLabel with Link
function BannerText({
  title,
  caption,
  link: {
    url: linkUrl = Props['BannerTextContent'].link,
    text: linkText = Props['BannerTextContent'].linkText,
  },
  variant = Props['BannerText'].variant ?? 'primary',
  colorVariant = Props['BannerText'].colorVariant ?? 'main',
}: BannerTextProps) {
  return (
    <Section className={`${styles.section} section-banner layout__section`}>
      <BannerTextWrapper
        {...Props['BannerText']}
        variant={variant}
        colorVariant={colorVariant}
      >
        <BannerTextContent
          {...Props['BannerTextContent']}
          title={title}
          caption={caption}
          link={linkUrl}
          linkText={linkText}
        />
      </BannerTextWrapper>
    </Section>
  )
}

export default BannerText
