import Link from 'gatsby-link'
import React, { FC } from 'react'
import { Button } from 'theme-ui'

interface Props {
  href: string
  label: string
}

const CardInfoAction: FC<Props> = ({ href, label }) => {
  const props = {
    as: Link,
    to: href,
    variant: 'card.info.action',
  }

  return <Button {...props}>{label}</Button>
}

export default CardInfoAction
