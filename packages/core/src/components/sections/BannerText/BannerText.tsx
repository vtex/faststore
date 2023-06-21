import type {
  BannerProps as UIBannerProps,
  BannerContentProps as UIBannerContentProps,
} from '@faststore/ui'

import {
  Banner,
  BannerContent,
} from 'src/components/sections/BannerText/Overrides'
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

// TODO: Change actionPath and actionLabel with Link
function BannerText({
  title,
  caption,
  link: {
    url: linkUrl = BannerContent.props.link,
    text: linkText = BannerContent.props.linkText,
  },
  variant = Banner.props.variant ?? 'primary',
  colorVariant = Banner.props.colorVariant ?? 'main',
}: BannerTextProps) {
  return (
    <Section className={`${styles.section} section-banner layout__section`}>
      <div className="layout__content">
        <Banner.Component
          {...Banner.props}
          variant={variant}
          colorVariant={colorVariant}
        >
          <BannerContent.Component
            {...BannerContent.props}
            title={title}
            caption={caption}
            link={linkUrl}
            linkText={linkText}
          />
        </Banner.Component>
      </div>
    </Section>
  )
}

export default BannerText
