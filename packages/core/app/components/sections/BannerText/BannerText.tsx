import {
  BannerTextContentProps as UIBannerTextContentProps,
  BannerTextProps as UIBannerTextProps,
} from '@faststore/ui'

import Section from '../../../../app/components/sections/Section'
import { OverrideContextType } from '../../../../app/sdk/overrides/OverrideContext'

import { getOverridableServerSection } from '../../../../app/sdk/overrides/getOverriddenSection'
import { BannerTextDefaultComponents } from './DefaultComponents'
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
  context: OverrideContextType<'BannerText'>['components']
}

// TODO: Change actionPath and actionLabel with Link
function BannerText({
  title,
  caption,
  link: { url: linkUrl, text: linkText, linkTargetBlank },
  variant,
  colorVariant,
  context,
}: BannerTextProps) {
  console.log('🚀 ~ BannerText:')
  const { BannerText: BannerTextWrapper, BannerTextContent } = context

  return (
    <Section className={`${styles.section} section-banner layout__section`}>
      <BannerTextWrapper.Component
        {...BannerTextWrapper.props}
        variant={variant ?? BannerTextWrapper.props.variant ?? 'primary'}
        colorVariant={
          colorVariant ?? BannerTextWrapper.props.colorVariant ?? 'main'
        }
      >
        <BannerTextContent.Component
          {...BannerTextContent.props}
          title={title}
          caption={caption}
          link={linkUrl ?? BannerTextContent.props.link}
          linkText={linkText ?? BannerTextContent.props.linkText}
          linkTargetBlank={
            linkTargetBlank ?? BannerTextContent.props.linkTargetBlank
          }
          variant={variant ?? BannerTextWrapper.props.variant ?? 'primary'}
          colorVariant={
            colorVariant ?? BannerTextWrapper.props.colorVariant ?? 'main'
          }
        />
      </BannerTextWrapper.Component>
    </Section>
  )
}

const OverridableBannerText = getOverridableServerSection<typeof BannerText>(
  'BannerText',
  BannerText,
  BannerTextDefaultComponents
)

export default OverridableBannerText
