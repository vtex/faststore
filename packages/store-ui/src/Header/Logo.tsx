import { Link } from 'gatsby'
import React, { FC } from 'react'

import { Flex } from '../index'

export interface HeaderLogoProps {
  variant?: string
  href?: string
  src: string
  title?: string
  height?: string
  viewBox?: string
}

export const HeaderLogo: FC<HeaderLogoProps> = ({
  variant,
  href = '/',
  src,
  title = 'Store Theme Logo',
  height = '12px',
  viewBox = '0 0 660 44',
}) => {
  const props = {
    as: Link,
    to: href,
    variant,
  }

  return (
    <Flex {...props}>
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        height={height}
        viewBox={viewBox}
        xmlSpace="preserve"
      >
        <title>{title}</title>
        <image id="image0" x="0" y="0" href={src} />
      </svg>
    </Flex>
  )
}
