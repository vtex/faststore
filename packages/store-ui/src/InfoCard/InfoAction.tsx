import React, { FC } from 'react'
import { Button } from 'theme-ui'

import LocalizedLink from '../LocalizedLink'

interface Props {
  href: string
  label: string
}

const InfoCardInfoAction: FC<Props> = ({ href, label }) => {
  const props = {
    as: LocalizedLink,
    to: href,
    variant: 'card.info.action',
  }

  return <Button {...props}>{label}</Button>
}

export default InfoCardInfoAction
