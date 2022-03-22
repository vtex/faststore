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
  const [isOpen, setIsOpen] = useState(isOpenDefault)
  const dropdownItemsRef = useRef<HTMLButtonElement[]>([])
  const selectedDropdownItemIndexRef = useRef(0)
  const dropdownButtonRef = useRef<HTMLButtonElement>(null)

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
    isOpen && dropdownItemsRef?.current[0]?.focus()
  }, [isOpen])

  const value = useMemo(() => {
    return {
      isOpen,
      close,
      open,
      toggle,
      dropdownButtonRef,
      onDismiss,
      selectedDropdownItemIndexRef,
      dropdownItemsRef,
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
