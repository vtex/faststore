import React, { FC } from 'react'

import Button from '../material-ui-components/Button'
import Link from '../material-ui-components/Link'

interface Props {
  to: string
  label: string
}

const ButtonAction: FC<Props> = ({ to, label }) => (
  <Link to={to}>
    <Button>{label}</Button>
  </Link>
)

export default ButtonAction
