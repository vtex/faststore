import {
  BannerTextProps as UIBannerTextProps,
  BannerTextContentProps as UIBannerTextContentProps,
} from '@faststore/ui'

import {
  BannerText as BannerTextWrapper,
  BannerTextContent,
} from 'src/components/sections/BannerText/Overrides'
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

// TODO: Change actionPath and actionLabel with Link
function BannerText({
  title,
  caption,
  link: {
    url: linkUrl = BannerTextContent.props.link,
    text: linkText = BannerTextContent.props.linkText,
  },
  variant = BannerTextWrapper.props.variant ?? 'primary',
  colorVariant = BannerTextWrapper.props.colorVariant ?? 'main',
}: BannerTextProps) {
  return (
    <Section className={`${styles.section} section-banner layout__section`}>
      <div className="layout__content">
        <BannerTextWrapper.Component
          {...BannerTextWrapper.props}
          variant={variant}
          colorVariant={colorVariant}
        >
          <BannerTextContent.Component
            {...BannerTextContent.props}
            title={title}
            caption={caption}
            link={linkUrl}
            linkText={linkText}
          />
        </BannerTextWrapper.Component>
      </div>
    </Section>
  )
}

export default BannerText
