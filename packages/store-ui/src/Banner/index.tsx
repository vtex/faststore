/** @jsx jsx */
import { FC } from 'react'
import { jsx } from 'theme-ui'

import LocalizedLink from '../LocalizedLink'

type Props = {
  imgSrc: string
  loading?: 'eager' | 'lazy'
  alt: string
  href: string
  width?: number | string
  height?: number | string
}

export const Banner: FC<Props> = ({
  imgSrc,
  href,
  alt,
  width,
  height,
  loading,
}) => {
  return (
    <LocalizedLink to={href}>
      <img
        sx={{ width: '100%', height: '100%' }}
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
      />
    </LocalizedLink>
  )
}
