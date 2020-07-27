import Link from 'gatsby-link'
import React, { PropsWithChildren } from 'react'
import { Flex, Image } from 'theme-ui'

interface Props {
  href: string
  alt: string
  src: string
}

function CardImage({ alt, src, href }: PropsWithChildren<Props>) {
  const linkProps = {
    as: Link,
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

export default CardImage
