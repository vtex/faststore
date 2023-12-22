import {
  HeroProps as UIHeroProps,
  HeroHeaderProps as UIHeroHeaderProps,
} from '@faststore/ui'
import { ReactNode } from 'react'
import { Image } from 'src/components/ui/Image'

import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'

import Section from '../Section'

import styles from './section.module.scss'
import { HeroDefaultComponents } from './DefaultComponents'
import { getOverridableSection } from 'src/sdk/overrides/getOverriddenSection'

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
  const {
    Hero: HeroWrapper,
    HeroImage,
    HeroHeader,
  } = useOverrideComponents<'Hero'>()

  return (
    <Section className={`${styles.section} section-hero`}>
      <HeroWrapper.Component
        {...HeroWrapper.props}
        variant={variant ?? HeroWrapper.props.variant ?? 'primary'}
        colorVariant={colorVariant ?? HeroWrapper.props.colorVariant ?? 'main'}
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
          linkTargetBlank={link?.linkTargetBlank}
          icon={icon}
          {...HeroHeader.props}
        />
      </HeroWrapper.Component>
    </Section>
  )
}

const OverridableHero = getOverridableSection(
  'Hero',
  Hero,
  HeroDefaultComponents
)

export default OverridableHero
