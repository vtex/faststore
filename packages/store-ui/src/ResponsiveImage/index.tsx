/* eslint-disable jsx-a11y/alt-text */
/** @jsx jsx */
import { FC, forwardRef } from 'react'
import { jsx } from 'theme-ui'

interface IResponsiveImageSource {
  media: string
  srcSet: string
  sizes?: string
}

interface IResponsiveImage {
  sources: IResponsiveImageSource[]
  heights: string[]
  src?: string
  alt: string
  height?: string
  width?: string
}

interface Props extends IResponsiveImage {
  loading: 'eager' | 'lazy'
  variant: string
}

const ResponsiveImage: FC<Props> = forwardRef<HTMLImageElement, Props>(
  ({ sources, heights, variant, ...imgProps }, ref) => (
    <picture
      sx={{
        variant: `${variant}.responsiveImage.picture`,
      }}
    >
      {sources.map((source) => (
        <source key={source.srcSet} {...source} />
      ))}
      <img
        sx={{
          variant: `${variant}.responsiveImage.img`,
          minHeight: heights,
        }}
        {...imgProps}
        ref={ref}
      />
    </picture>
  )
)

export default ResponsiveImage
