import type { ReactNode } from 'react'
import React from 'react'

import Button from '../../atoms/Button'
import { useDropdown } from './contexts/DropdownContext'

export type DropdownButtonProps = {
  children: ReactNode
}

const DropdownButton = ({ children }: DropdownButtonProps) => {
  const { toggle, buttonDropdownRef } = useDropdown()

  return (
    <Button onClick={toggle} ref={buttonDropdownRef}>
      {children}
    </Button>
  )
}

export default DropdownButton
