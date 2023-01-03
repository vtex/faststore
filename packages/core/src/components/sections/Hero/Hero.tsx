import type {
  HeroHeadingProps as UIHeroHeadingProps,
  HeroImageProps as UIHeroImageProps,
  HeroProps as UIHeroProps,
} from '@faststore/ui'
import {
  Hero as UIHero,
  HeroHeading as UIHeroHeading,
  HeroImage as UIHeroImage,
} from '@faststore/ui'

import { Image } from 'src/components/ui/Image'

import Section from '../Section'

export type HeroProps = UIHeroProps &
  UIHeroHeadingProps &
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
    <Section>
      <UIHero>
        <UIHeroImage data-fs-hero-image>
          <Image
            preload
            loading="eager"
            fetchPriority="high"
            src={imageSrc}
            alt={imageAlt}
            width={360}
            height={240}
            sizes="(max-width: 768px) 70vw, 50vw"
          />
        </UIHeroImage>
        <UIHeroHeading
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
