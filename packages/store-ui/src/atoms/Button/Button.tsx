import type { FC } from 'react'
import React from 'react'

const Button: FC = ({ children, ...props }) => {
  return <button {...props}>{children}</button>
}

export default Button
