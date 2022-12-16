import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface HeroImageProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Specifies the image URL.
   */
  imageSrc: string
  /**
   * Alternative description of the image.
   */
  imageAlt: string
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const HeroImage = forwardRef<HTMLDivElement, HeroImageProps>(function HeroImage(
  { imageAlt, imageSrc, children, testId = 'fs-hero-image', ...otherProps },
  ref
) {
  return (
    <div ref={ref} data-fs-hero-image data-testid={testId} {...otherProps}>
      <picture>
        <source srcSet={imageSrc} type="image/webp" />
        <img
          data-fs-image
          loading="eager"
          src={imageSrc}
          alt={imageAlt}
          width={360}
          height={240}
          sizes="(max-width: 768px) 70vw, 50vw"
        />
      </picture>
    </div>
  )
})

export default HeroImage
