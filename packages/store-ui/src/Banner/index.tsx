import React, { FC } from 'react'

type Props = {
  imgSrc: string
  alt: string
  href: string
  width?: number | string
  height?: number | string
}

export const Banner: FC<Props> = ({ imgSrc, href, alt, width, height }) => {
  return (
    <a href={href}>
      <img src={imgSrc} alt={alt} width={width} height={height} />
    </a>
  )
}
