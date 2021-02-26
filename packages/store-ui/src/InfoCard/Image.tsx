import React from 'react'
import { Flex, Image } from 'theme-ui'
import type { FC } from 'react'

import LocalizedLink from '../LocalizedLink'

interface Props {
  href: string
  alt: string
  src: string
  height?: string
  width?: string
}

const InfoCardImage: FC<Props> = ({ alt, src, href, height, width }) => {
  const linkProps = {
    as: LocalizedLink,
    to: href,
    variant: 'card.image.link',
  }

  return (
    <Flex variant="card.image">
      <Flex {...linkProps}>
        <Image
          variant="card.image.content"
          height={height}
          width={width}
          alt={alt}
          src={src}
          loading="lazy"
        />
      </Flex>
    </Flex>
  )
}

export default InfoCardImage
