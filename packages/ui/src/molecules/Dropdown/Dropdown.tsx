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
    dropdownButtonRef.current?.focus()
  }, [onDismiss])

  const open = () => {
    setIsOpen(true)
  }

  const toggle = useCallback(() => {
    setIsOpen((old) => {
      if (old) {
        onDismiss?.()
        dropdownButtonRef.current?.focus()
      }

      return !old
    })
  }, [onDismiss])

  useEffect(() => {
    setIsOpen(isOpenDefault)
  }, [isOpenDefault])

  useEffect(() => {
    isOpen && dropdownItemsRef?.current[0]?.focus()
  }, [isOpen])

  useEffect(() => {
    let firstClick = true

    const event = (e: MouseEvent) => {
      const someItemWasClicked = dropdownItemsRef?.current.some(
        (item) => e.target === item
      )

      if (firstClick) {
        firstClick = false

        return
      }

      !someItemWasClicked && close()
    }

    if (isOpen) {
      document.addEventListener('click', event)
    } else {
      document.removeEventListener('click', event)
    }

    return () => {
      document.removeEventListener('click', event)
    }
  }, [close, isOpen])

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
  }, [close, id, isOpen, onDismiss, toggle])

  return (
    <DropdownContext.Provider value={value}>
      {children}
    </DropdownContext.Provider>
  )
}

export default Dropdown
