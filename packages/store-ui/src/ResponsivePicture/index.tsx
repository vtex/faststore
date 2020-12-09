/* eslint-disable jsx-a11y/alt-text */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import type { FC } from 'react'

interface IResponsivePictureSource {
  media: string
  srcSet: string
  sizes?: string
}

interface IResponsivePicture {
  sources: IResponsivePictureSource[]
  src?: string
  alt: string
  height?: string
  width?: string
}

interface Props extends IResponsivePicture {
  loading: 'eager' | 'lazy'
  variant: string
}

const ResponsivePicture: FC<Props> = ({ sources, variant, ...imgProps }) => (
  <picture
    sx={{
      variant: `${variant}.responsivePicture.picture`,
    }}
  >
    {sources.map((source) => (
      <source key={source.srcSet} {...source} />
    ))}
    <img
      sx={{
        variant: `${variant}.responsivePicture.img`,
      }}
      {...imgProps}
    />
  </picture>
)

export default ResponsivePicture
