import {
  BannerTextContentProps as UIBannerTextContentProps,
  BannerTextProps as UIBannerTextProps,
} from '@faststore/ui'

import Section from '../Section'

import {
  BannerTextContent,
  BannerText as BannerTextWrapper,
} from '@faststore/ui'
import styles from './section.module.scss'

export interface BannerTextProps {
  title: UIBannerTextContentProps['title']
  caption: UIBannerTextContentProps['caption']
  link?: {
    text?: string
    url?: string
    linkTargetBlank?: boolean
  }
  colorVariant?: UIBannerTextProps['colorVariant']
  variant?: UIBannerTextProps['variant']
}

// TODO: Change actionPath and actionLabel with Link
function BannerText({
  title,
  caption,
  link: { url: linkUrl, text: linkText, linkTargetBlank },
  variant,
  colorVariant,
}: BannerTextProps) {
  return (
    <Section className={`${styles.section} section-banner layout__section`}>
      <BannerTextWrapper
        variant={variant ?? 'primary'}
        colorVariant={colorVariant ?? 'main'}
      >
        <BannerTextContent
          title={title}
          caption={caption}
          link={linkUrl}
          linkText={linkText}
          linkTargetBlank={linkTargetBlank}
        />
      </BannerTextWrapper>
    </Section>
  )
}

export default BannerText
