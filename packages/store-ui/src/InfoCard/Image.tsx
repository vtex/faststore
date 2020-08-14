import React, { FC } from 'react'
import { Flex, Image, } from 'theme-ui'
import LocalizedLink from '../LocalizedLink'

interface Props {
  href: string
  alt: string
  src: string
}

const InfoCardImage: FC<Props> = ({ alt, src, href }) => {
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
          alt={alt}
          src={src}
          loading="lazy"
        />
      </Flex>
    </Flex>
  )
}

export default InfoCardImage
