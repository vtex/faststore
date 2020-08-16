import React, { useState, useCallback } from 'react'
import { Button } from 'theme-ui'

interface ChildProps {
  active: boolean
  toggle: () => void
}

interface Props {
  variant: string
  defaultActive: boolean
  children: ({ active, toggle }: ChildProps) => JSX.Element
}

export const ToggleButton = ({ defaultActive, variant, children }: Props) => {
  const [active, setActive] = useState(defaultActive)
  const toggle = useCallback(() => setActive(!active), [active])

  return (
    <Button variant={variant} onClick={() => setActive(!active)}>
      {children({ active, toggle })}
    </Button>
  )
}
