import type { HeroProps as UIHeroProps } from '@faststore/ui'
import {
  Hero as UIHero,
  HeroHeader as UIHeroHeader,
  HeroImage as UIHeroImage,
} from '@faststore/ui'
import { ReactNode } from 'react'
import { Image } from 'src/components/ui/Image'
import Section from '../Section'

import styles from './section.module.scss'

export type HeroProps = {
  title: string
  subtitle: string
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

const Hero = ({
  link,
  title,
  subtitle,
  image,
  variant = 'primary',
  colorVariant = 'main',
  icon,
}: HeroProps) => {
  return (
    <Section className={`${styles.section} section-hero`}>
      <UIHero colorVariant={colorVariant} variant={variant}>
        <UIHeroImage data-fs-hero-image>
          <Image
            loading="eager"
            priority
            src={image.src}
            alt={image.alt}
            width={360}
            height={240}
            sizes="(max-width: 768px) 70vw, 50vw"
          />
        </UIHeroImage>
        <UIHeroHeader
          title={title}
          subtitle={subtitle}
          link={link?.url}
          linkText={link?.text}
          icon={icon}
        />
      </UIHero>
    </Section>
  )
}

export default Hero
