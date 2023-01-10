import { createContext } from 'react'

export type DropdownContextState = {
  /**
   * Control de Dropdown state as Opened (true) or Closed (false).
   */
  isOpen: boolean
  /**
   * Reference to DropdownButton, used to calculate a position for the DropdownMenu.
   */
  dropdownButtonRef: React.RefObject<HTMLButtonElement> | null
  /**
   * Reference to a selected DropdownItem, used to manipulate focus.
   */
  selectedDropdownItemIndexRef: React.MutableRefObject<number> | null
  /**
   * Array of References to dropdownItems in a DropdownMenu.
   */
  dropdownItemsRef: React.MutableRefObject<HTMLButtonElement[]> | null
  /**
   * Close DropdownMenu event inherited from Modal.
   */
  onDismiss?(): void
  /**
   * Function responsible for close the DropdownMenu in this context.
   */
  close?(): void
  /**
   * Function responsible for open the DropdownMenu in this context.
   */
  open?(): void
  /**
   * Function responsible for switch the the DropdownMenu state in this context.
   */
  toggle?(): void

  /**
   * Identifier to be used in aria-controls
   */
  id: string
}

const defaultState: DropdownContextState = {
  isOpen: false,
  dropdownButtonRef: null,
  selectedDropdownItemIndexRef: null,
  dropdownItemsRef: null,
  id: 'fs-dropdown',
}

const DropdownContext = createContext<DropdownContextState>(defaultState)

export default DropdownContext
