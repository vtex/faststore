import type { ReactNode } from 'react'
import React, { useRef, useMemo, useState, useEffect } from 'react'

import DropdownContext from './contexts/DropdownContext'

export type DropdownProps = {
  children: ReactNode
  onDismiss?(): void
  isOpen?: boolean
  id?: string
}

const Dropdown = ({
  children,
  isOpen: isOpenDefault = false,
  onDismiss,
  id = 'store-dropdown',
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownItensRef = useRef<HTMLButtonElement[]>([])
  const selectedDropdownItemRef = useRef(0)
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
    setIsOpen(isOpenDefault)
  }, [isOpenDefault])

  useEffect(() => {
    isOpen && dropdownItensRef?.current[0]?.focus()
  }, [isOpen])

  const value = useMemo(() => {
    return {
      isOpen,
      close,
      open,
      toggle,
      buttonDropdownRef,
      onDismiss,
      selectedDropdownItemRef,
      dropdownItensRef,
      id,
    }
  }, [id, isOpen, onDismiss])

  return (
    <DropdownContext.Provider value={value}>
      {children}
    </DropdownContext.Provider>
  )
}

export default Dropdown
