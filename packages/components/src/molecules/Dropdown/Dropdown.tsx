import type { PropsWithChildren } from 'react'
import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react'

import DropdownContext from '../Dropdown/contexts/DropdownContext'

export interface DropdownProps {
  /**
   * Event emitted when the Dropdown is closed.
   */
  onDismiss?(): void
  /**
   * A boolean value that represents the state of the Dropdown.
   */
  isOpen?: boolean
  /**
   * ID to identify Dropdown.
   */
  id?: string
}

const Dropdown = ({
  children,
  isOpen: isOpenControlled,
  onDismiss,
  id = 'fs-dropdown',
}: PropsWithChildren<DropdownProps>) => {
  const [isOpenInternal, setIsOpenInternal] = useState(false)
  const dropdownItemsRef = useRef<HTMLElement[]>([])
  const selectedDropdownItemIndexRef = useRef(0)
  const dropdownTriggerRef = useRef<HTMLElement | null>(null)

  const isOpen = isOpenControlled ?? isOpenInternal

  const close = useCallback(() => {
    setIsOpenInternal(false)
    onDismiss?.()
  }, [onDismiss])

  const open = () => {
    setIsOpenInternal(true)
  }

  const toggle = useCallback(() => {
    setIsOpenInternal((currentIsOpen) => {
      if (currentIsOpen) {
        onDismiss?.()
        dropdownTriggerRef.current?.focus()
      }

      return !currentIsOpen
    })
  }, [onDismiss])

  const addDropdownTriggerRef = useCallback(<T extends HTMLElement = HTMLElement>(ref: T) => {
    dropdownTriggerRef.current = ref
  }, [])

  useEffect(() => {
    setIsOpenInternal(isOpenControlled ?? false)
  }, [isOpenControlled])

  useEffect(() => {
    if(isOpen) {
      dropdownItemsRef?.current[0]?.focus()
      document.body.style.overflow = 'hidden'

      return
    }

    document.body.style.overflow = 'auto'
  }, [isOpen])

  useEffect(() => {
    let firstClick = true

    const event = (e: MouseEvent) => {
      const wasSomeItemClicked = dropdownItemsRef?.current.some(
        (item) => e.target === item || item.contains(e.target as Node)
      )

      if (firstClick) {
        firstClick = false

        return
      }

      !wasSomeItemClicked && close()
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
      dropdownTriggerRef,
      addDropdownTriggerRef,
      selectedDropdownItemIndexRef,
      dropdownItemsRef,
      id,
    }
  }, [isOpen, close, toggle, addDropdownTriggerRef, id])

  return (
    <DropdownContext.Provider value={value}>
      {children}
    </DropdownContext.Provider>
  )
}

export default Dropdown
