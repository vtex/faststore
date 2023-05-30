import { BannerTextProps as UIBannerTextProps } from 'src/components/ui/BannerText'
import Section from '../Section'
import { Components, Props } from './Overrides'

import styles from './section.module.scss'

export interface BannerTextProps {
  title: string
  caption: string
  link?: {
    text?: string
    url?: string
  }
  colorVariant?: UIBannerTextProps['colorVariant']
  variant?: UIBannerTextProps['variant']
}

const { BannerText: BannerTextWrapper } = Components

// TODO: Change actionPath and actionLabel with Link
function BannerText({
  title = Props['BannerText'].title,
  caption = Props['BannerText'].caption,
  link: {
    url = Props['BannerText'].actionPath,
    text = Props['BannerText'].actionLabel,
  } = {},
  variant = Props['BannerText'].variant,
  colorVariant = Props['BannerText'].colorVariant ?? 'main',
}: BannerTextProps) {
  return (
    <Section className={`${styles.section} section-banner layout__section`}>
      <div className="layout__content">
        <BannerTextWrapper
          {...Props['BannerText']}
          variant={variant}
          title={title}
          caption={caption}
          actionPath={url}
          actionLabel={text}
          colorVariant={colorVariant}
        />
      </div>
    </Section>
  )
}

export default BannerText
