import { BannerTextProps as UIBannerTextProps } from '@faststore/ui'
import {
  BannerText as BannerTextWrapper,
  BannerTextContent,
} from 'src/components/sections/BannerText/Overrides'
import { CustomBannerTextContentProps } from './CustomBannerTextContent'
import Section from '../Section'

import styles from './section.module.scss'

export interface BannerTextProps {
  title: CustomBannerTextContentProps['title']
  caption: CustomBannerTextContentProps['caption']
  link?: {
    text?: string
    url?: string
    targetBlank?: boolean
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
    targetBlank,
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
            variant={variant}
            colorVariant={colorVariant}
            targetBlank={targetBlank}
          />
        </BannerTextWrapper.Component>
      </div>
    </Section>
  )
}

export default BannerText
