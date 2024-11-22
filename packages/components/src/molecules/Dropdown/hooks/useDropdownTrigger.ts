import { useDropdown } from './useDropdown'
import React, { useImperativeHandle } from 'react'

type UseDropdownTriggerProps<T extends HTMLElement = HTMLElement> = {
  triggerRef: React.ForwardedRef<T>
  label?: string
}

export const useDropdownTrigger = <T extends HTMLElement = HTMLElement>({
  triggerRef,
}: UseDropdownTriggerProps<T>) => {
  const { toggle, dropdownTriggerRef, addDropdownTriggerRef, isOpen, id } =
    useDropdown<T>()

  useImperativeHandle(triggerRef, () => dropdownTriggerRef!.current!, [
    dropdownTriggerRef,
  ])

  return {
    onClick: toggle,
    ref: addDropdownTriggerRef,
    'aria-expanded': isOpen,
    'aria-controls': id,
    'aria-haspopup': 'menu' as const,
  }
}
