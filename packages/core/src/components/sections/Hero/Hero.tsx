import {
  HeroProps as UIHeroProps,
  HeroHeaderProps as UIHeroHeaderProps,
} from '@faststore/ui'
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
          icon={icon}
          {...HeroHeader.props}
        />
      </HeroWrapper.Component>
    </Section>
  )
}

export default Hero
