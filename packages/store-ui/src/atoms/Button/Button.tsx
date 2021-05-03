import type { FC, ReactNode } from 'react'
import React from 'react'

export type ButtonProps = {
  children: ReactNode
}

const Button: FC<ButtonProps> = ({ children, ...props }) => {
  return <button {...props}>{children}</button>
}

export default Button
