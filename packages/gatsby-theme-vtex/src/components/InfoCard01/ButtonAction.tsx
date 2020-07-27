import { Button } from 'theme-ui'
import React, { FC } from 'react'
import { Link } from 'gatsby'

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
