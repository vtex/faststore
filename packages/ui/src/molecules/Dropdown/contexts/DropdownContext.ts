import { createContext, useContext } from 'react'

export type DropdownContextState = {
  isOpen: boolean
  buttonDropdownRef: React.RefObject<HTMLButtonElement> | null
  onDismiss?(): void
  close?(): void
  open?(): void
  toggle?(): void
}

const defaultState: DropdownContextState = {
  isOpen: false,
  buttonDropdownRef: null,
}

const DropdownContext = createContext<DropdownContextState>(defaultState)

export default DropdownContext

export const useDropdown = () => {
  const context = useContext<DropdownContextState>(DropdownContext)

  if (context === undefined) {
    throw new Error(
      'Do not use DropdownItem components outside the Dropdown context.'
    )
  }

  return context
}
