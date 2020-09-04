/** @jsx jsx */
import { FC } from 'react'
import { jsx, Image } from 'theme-ui'

import LocalizedLink from '../LocalizedLink'

type Props = {
  src: string
  alt: string
  href: string
  width: number | string
  height: number | string
  loading?: 'eager' | 'lazy'
}

export const Banner: FC<Props> = ({
  src,
  href,
  alt,
  width,
  height,
  loading = 'lazy',
}) => (
  <LocalizedLink to={href}>
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
    />
  </LocalizedLink>
)
