import {
  HeroProps as UIHeroProps,
  HeroHeaderProps as UIHeroHeaderProps,
} from '@faststore/ui'
import { Components, Props } from './Overrides'
import { ReactNode } from 'react'
import { Image } from 'src/components/ui/Image'
import Section from '../Section'

import styles from './section.module.scss'

export type HeroProps = {
  title: UIHeroHeaderProps['title']
  subtitle: UIHeroHeaderProps['subtitle']
  link?: {
    text: string
    url: string
  }
  image: {
    src: string
    alt: string
  }
  variant?: UIHeroProps['variant']
  colorVariant?: UIHeroProps['colorVariant']
  icon?: ReactNode
}

const { Hero: HeroWrapper, HeroImage, HeroHeader } = Components

const Hero = ({
  link,
  title,
  subtitle,
  image,
  variant = Props['Hero'].variant ?? 'primary',
  colorVariant = Props['Hero'].colorVariant ?? 'main',
  icon,
}: HeroProps) => {
  return (
    <Section className={`${styles.section} section-hero`}>
      <HeroWrapper
        {...Props['Hero']}
        variant={variant}
        colorVariant={colorVariant}
      >
        <HeroImage {...Props['HeroImage']}>
          <Image
            loading="eager"
            src={image.src}
            alt={image.alt}
            width={360}
            height={240}
            sizes="(max-width: 360px) 50vw, (max-width: 768px) 90vw, 50vw"
          />
        </HeroImage>
        <HeroHeader
          title={title}
          subtitle={subtitle}
          link={link?.url}
          linkText={link?.text}
          icon={icon}
          {...Props['HeroHeader']}
        />
      </HeroWrapper>
    </Section>
  )
}

export default Hero
