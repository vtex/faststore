import {
  HeroHeaderProps as UIHeroHeaderProps,
  HeroProps as UIHeroProps,
} from '@faststore/ui'
import { ReactNode } from 'react'
import { Image } from '../../ui/Image'

import { OverrideContextType } from '../../../sdk/overrides/OverrideContext'

import Section from 'app/components/sections/Section/Section'

import { getOverridableServerSection } from '../../../sdk/overrides/getOverriddenSection'
import { HeroDefaultComponents } from './DefaultComponents'
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
  context: OverrideContextType<'Hero'>['components']
}

const Hero = ({
  link,
  title,
  subtitle,
  image,
  variant,
  colorVariant,
  icon,
  context,
}: HeroProps) => {
  console.log('🚀 ~ Hero:')
  const { Hero: HeroWrapper, HeroImage, HeroHeader } = context

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
          variant={variant}
          colorVariant={colorVariant}
          {...HeroHeader.props}
        />
      </HeroWrapper.Component>
    </Section>
  )
}

const OverridableHero = getOverridableServerSection<typeof Hero>(
  'Hero',
  Hero,
  HeroDefaultComponents
)

export default OverridableHero
