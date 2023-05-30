import { BannerTextProps as UIBannerTextProps } from 'src/components/ui/BannerText'
import Section from '../Section'
import { Components, Props } from './Overrides'

import styles from './section.module.scss'

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

const { BannerText: BannerTextWrapper } = Components

// TODO: Change actionPath and actionLabel with Link
function BannerText({
  title,
  caption,
  link: { url = Props['BannerText'].url, text = Props['BannerText'].text },
  variant,
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
