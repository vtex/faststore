import {
  BannerTextContentProps as UIBannerTextContentProps,
  BannerTextProps as UIBannerTextProps,
} from '@faststore/ui'

import { useOverrideComponents } from '../../../sdk/overrides/OverrideContext'
import Section from '../Section'

import { getOverridableSection } from '../../../sdk/overrides/getOverriddenSection'
import { BannerTextDefaultComponents } from './DefaultComponents'

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
  const { BannerText: BannerTextWrapper, BannerTextContent } =
    useOverrideComponents<'BannerText'>()

  return (
    <Section className={`section-banner layout__section`}>
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
        />
      </BannerTextWrapper.Component>
    </Section>
  )
}

const OverridableBannerText = getOverridableSection<typeof BannerText>(
  'BannerText',
  BannerText,
  BannerTextDefaultComponents
)

export default OverridableBannerText
