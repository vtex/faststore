import React from 'react'
import { Image } from 'theme-ui'
import type { FC, AnchorHTMLAttributes, ComponentType } from 'react'

import LocalizedLink from '../LocalizedLink'

type Props = {
  src: string
  alt: string
  href: string
  width: number | string
  height: number | string
  loading?: 'eager' | 'lazy'
  Link?: ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>>
}

const Banner: FC<Props> = ({
  src,
  href,
  alt,
  width,
  height,
  loading = 'lazy',
  Link = 'a',
}) => (
  <LocalizedLink Link={Link} href={href}>
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
    />
  </LocalizedLink>
)

export default Banner
