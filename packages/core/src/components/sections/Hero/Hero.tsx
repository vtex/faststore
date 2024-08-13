import {
  HeroHeader,
  HeroImage,
  Hero as HeroWrapper,
  HeroHeaderProps as UIHeroHeaderProps,
  HeroProps as UIHeroProps,
} from '@faststore/ui'
import { ReactNode } from 'react'
import { Image } from '../../../components/ui/Image'

import Section from '../Section'

import styles from './section.module.scss'

export type HeroProps = {
  title: UIHeroHeaderProps['title']
  subtitle: UIHeroHeaderProps['subtitle']
  link?: {
    text: string
    url: string
    linkTargetBlank: boolean
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
  variant,
  colorVariant,
  icon,
}: HeroProps) => {
  return (
    <Section className={`${styles.section} section-hero`}>
      <HeroWrapper
        variant={variant ?? 'primary'}
        colorVariant={colorVariant ?? 'main'}
      >
        <HeroImage>
          <Image
            loading="eager"
            src={image.src}
            alt={image.alt}
            width={360}
            height={240}
            sizes="(max-width: 360px) 40vw, (max-width: 768px) 90vw, 50vw"
          />
        </HeroImage>
        <HeroHeader
          title={title}
          subtitle={subtitle}
          link={link?.url}
          linkText={link?.text}
          linkTargetBlank={link?.linkTargetBlank}
          icon={icon}
        />
      </HeroWrapper>
    </Section>
  )
}

export default Hero
