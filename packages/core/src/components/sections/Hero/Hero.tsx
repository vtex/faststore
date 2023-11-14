import { HeroProps as UIHeroProps } from '@faststore/ui'
import { CustomHeroHeaderProps } from './CustomHeroHeader'
import { ReactNode } from 'react'
import { Image } from 'src/components/ui/Image'
import {
  Hero as HeroWrapper,
  HeroImage,
  HeroHeader,
} from 'src/components/sections/Hero/Overrides'

import Section from '../Section'

import styles from './section.module.scss'

export type HeroProps = {
  title: CustomHeroHeaderProps['title']
  subtitle: CustomHeroHeaderProps['subtitle']
  link?: {
    text: string
    url: string
    targetBlank: boolean
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
  variant = HeroWrapper.props.variant ?? 'primary',
  colorVariant = HeroWrapper.props.colorVariant ?? 'main',
  icon,
}: HeroProps) => {
  return (
    <Section className={`${styles.section} section-hero`}>
      <HeroWrapper.Component
        {...HeroWrapper.props}
        variant={variant}
        colorVariant={colorVariant}
      >
        <HeroImage.Component {...HeroImage.props}>
          <Image
            loading="eager"
            src={image.src}
            alt={image.alt}
            width={360}
            height={240}
            sizes="(max-width: 360px) 50vw, (max-width: 768px) 90vw, 50vw"
          />
        </HeroImage.Component>
        <HeroHeader.Component
          title={title}
          subtitle={subtitle}
          link={link?.url}
          linkText={link?.text}
          targetBlank={link?.targetBlank}
          icon={icon}
          variant={variant}
          colorVariant={colorVariant}
          {...HeroHeader.props}
        />
      </HeroWrapper.Component>
    </Section>
  )
}

export default Hero
