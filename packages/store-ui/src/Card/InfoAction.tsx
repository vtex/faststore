import Link from 'gatsby-link'
import React, { PropsWithChildren } from 'react'
import { Button } from 'theme-ui'

interface Props {
  href: string
  label: string
}

function CardInfoAction({ href, label }: PropsWithChildren<Props>) {
  const props = {
    as: Link,
    to: href,
    variant: 'card.info.action',
  }

  return <Button {...props}>{label}</Button>
}

export default CardInfoAction
