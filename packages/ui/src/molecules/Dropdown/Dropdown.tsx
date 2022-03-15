import type { ReactNode } from 'react'
import React, { useRef, useMemo, useState, useEffect } from 'react'

import DropdownContext from './contexts/DropdownContext'

export type DropdownProps = {
  children: ReactNode
  onDismiss?(): void
  isOpen?: boolean
}

const Dropdown = ({
  children,
  isOpen: isOpenProp,
  onDismiss,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonDropdownRef = useRef<HTMLButtonElement>(null)

  const close = () => {
    setIsOpen(false)
  }

  const open = () => {
    setIsOpen(true)
  }

  const toggle = () => {
    setIsOpen((old) => !old)
  }

  useEffect(() => {
    if (isOpenProp !== undefined) {
      setIsOpen(isOpenProp)
    }
  }, [isOpenProp])

  const value = useMemo(() => {
    return { isOpen, close, open, toggle, buttonDropdownRef, onDismiss }
  }, [isOpen, onDismiss])

  return (
    <DropdownContext.Provider value={value}>
      {children}
    </DropdownContext.Provider>
  )
}

export default Dropdown
