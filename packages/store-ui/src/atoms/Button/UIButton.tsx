import type { FC } from 'react'
import React from 'react'
import { Button } from 'theme-ui'

import type { ButtonProps } from './Button'
import RootButton from './Button'

export type UIButtonProps = ButtonProps & {
  variant: string
}

const UIButton: FC<UIButtonProps> = ({
  children,
  variant = 'sui-button',
  ...props
}) => {
  return (
    <Button as={RootButton} variant={variant} {...props}>
      {children}
    </Button>
  )
}

export default UIButton
