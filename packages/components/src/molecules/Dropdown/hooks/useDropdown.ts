import { useContext } from 'react'

import type { DropdownContextState, DropdownItemElement, DropdownTriggerElement } from '../contexts/DropdownContext'
import DropdownContext from '../contexts/DropdownContext'

/**
 * Hook to use the Dropdown context.
 * @returns Dropdown context.
 */
export const useDropdown = <T extends DropdownTriggerElement = DropdownTriggerElement, E extends DropdownItemElement = DropdownItemElement>() => {
  const context = useContext<DropdownContextState<DropdownTriggerElement, DropdownItemElement>>(DropdownContext)

  if (context === undefined) {
    throw new Error('Do not use useDropdown hook outside the Dropdown context.')
  }

  return context as DropdownContextState<T, E>
}
