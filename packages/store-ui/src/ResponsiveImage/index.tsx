/* eslint-disable jsx-a11y/alt-text */
/** @jsx jsx */
import { FC } from 'react'
import { jsx } from 'theme-ui'

export interface IResponsiveImageSource {
  media: string
  srcSet: string
  sizes?: string
}

export interface IResponsiveImage {
  sources: IResponsiveImageSource[]
  heights: string[]
  src?: string
  alt: string
  height?: string
  width?: string
}

interface Props extends IResponsiveImage {
  loading: 'eager' | 'lazy'
  variant?: string
}

const ResponsiveImage: FC<Props> = ({
  sources,
  heights,
  variant,
  ...imgProps
}) => (
  <picture
    sx={{
      display: 'block',
      overflow: 'hidden',
      variant: variant ? `${variant}.picture` : 'picture',
    }}
  >
    {sources.map((source) => (
      <source key={source.srcSet} {...source} />
    ))}
    <img
      {...imgProps}
      sx={{
        variant: variant ? `${variant}.img` : 'img',
        minHeight: heights,
        minWidth: '100%',
        width: 'auto',
        marginLeft: '50%',
        transform: 'translateX(-50%)',
        zIndex: -2,
      }}
    />
  </picture>
)

export default ResponsiveImage
