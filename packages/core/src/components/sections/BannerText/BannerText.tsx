import Section from '../Section'
import UIBannerText, {
  BannerTextProps as UIBannerTextProps,
} from 'src/components/ui/BannerText'

export interface BannerTextProps {
  title: string
  caption: string
  link?: {
    text: string
    url: string
  }
  colorVariant?: UIBannerTextProps['colorVariant']
  variant?: UIBannerTextProps['variant']
}

// TODO: Change actionPath and actionLabel with Link
function BannerText({
  title,
  caption,
  link,
  variant,
  colorVariant = 'main',
}: BannerTextProps) {
  return (
    <Section className="layout__section">
      <UIBannerText
        variant={variant}
        title={title}
        caption={caption}
        actionPath={link?.url}
        actionLabel={link?.text}
      />
    </Section>
  )
}

export default BannerText
