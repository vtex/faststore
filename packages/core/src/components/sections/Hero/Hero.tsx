import type {
  HeroHeaderProps as UIHeroHeaderProps,
  HeroImageProps as UIHeroImageProps,
  HeroProps as UIHeroProps,
} from '@faststore/ui'
import {
  Hero as UIHero,
  HeroHeader as UIHeroHeader,
  HeroImage as UIHeroImage,
} from '@faststore/ui'

import { Image } from 'src/components/ui/Image'

import Section from '../Section'
import styles from './section.module.scss'

export type HeroProps = UIHeroProps &
  UIHeroHeaderProps &
  UIHeroImageProps & {
    /**
     * Specifies the image URL.
     */
    imageSrc: string
    /**
     * Alternative description of the image.
     */
    imageAlt: string
  }

const Hero = ({
  icon,
  link,
  title,
  subtitle,
  linkText,
  imageAlt,
  imageSrc,
}: HeroProps) => {
  return (
    <Section className={`${styles.section} section-hero`}>
      <UIHero>
        <UIHeroImage data-fs-hero-image>
          <Image
            loading="eager"
            priority
            src={imageSrc}
            alt={imageAlt}
            width={360}
            height={240}
            sizes="(max-width: 768px) 70vw, 50vw"
          />
        </UIHeroImage>
        <UIHeroHeader
          title={title}
          subtitle={subtitle}
          link={link}
          linkText={linkText}
          icon={icon}
        />
      </UIHero>
    </Section>
  )
}

export default Hero
