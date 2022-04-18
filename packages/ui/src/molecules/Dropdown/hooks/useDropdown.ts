import { useContext } from 'react'

import type { DropdownContextState } from '../contexts/DropdownContext'
import DropdownContext from '../contexts/DropdownContext'

/**
 * Hook to use the Dropdown context.
 * @returns Dropdown context.
 */
export const useDropdown = () => {
  const context = useContext<DropdownContextState>(DropdownContext)

  if (context === undefined) {
    throw new Error('Do not use useDropdown hook outside the Dropdown context.')
  }

  return context
}
