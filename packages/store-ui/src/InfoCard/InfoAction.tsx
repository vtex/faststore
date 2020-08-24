import React, { FC } from 'react'
import { Button, Link } from 'theme-ui'

interface Props {
  href: string
  label: string
}

const InfoCardInfoAction: FC<Props> = ({ href, label }) => {
  const props = {
    as: Link,
    to: href,
    variant: 'card.info.action',
  }

  return <Button {...props}>{label}</Button>
}

export default InfoCardInfoAction
