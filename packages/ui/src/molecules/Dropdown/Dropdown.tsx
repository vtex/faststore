import type { ReactNode } from 'react'
import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react'

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

  const close = useCallback(() => {
    setIsOpen(false)
    onDismiss?.()
  }, [onDismiss])

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

  useEffect(() => {
    const event = (e: MouseEvent) => {
      const someItemWasClicked = dropdownItemsRef?.current.some(
        (item) => e.target === item
      )

      if (!someItemWasClicked && e.target !== dropdownButtonRef?.current) {
        close?.()
      }
    }

    if (isOpen) {
      document.addEventListener('click', event)
    } else {
      document.removeEventListener('click', event)
    }

    return () => {
      document.removeEventListener('click', event)
    }
  }, [close, dropdownButtonRef, isOpen])

  useEffect(() => {
    const event = (e: MouseEvent) => {
      const someItemWasClicked = dropdownItemsRef?.current.some(
        (item) => e.target === item
      )

      if (!someItemWasClicked && e.target !== dropdownButtonRef.current) {
        close?.()
      }
    }

    document.addEventListener('click', event)

    return () => {
      document.removeEventListener('click', event)
    }
  }, [close, dropdownItemsRef, dropdownButtonRef])

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
  }, [close, id, isOpen, onDismiss])

  return (
    <DropdownContext.Provider value={value}>
      {children}
    </DropdownContext.Provider>
  )
}

export default Dropdown
