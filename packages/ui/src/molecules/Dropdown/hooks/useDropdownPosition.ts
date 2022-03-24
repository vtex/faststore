import { useDropdown } from './useDropdown'

type DropdownPosition = {
  position: 'absolute'
  top: number
  left: number
}

/**
 * Hook used to find the DropdownMenu position in relation to DropdownButton
 * @returns Style with positions.
 */
export const useDropdownPosition = (): DropdownPosition => {
  const { dropdownButtonRef } = useDropdown()
  const buttonRect = dropdownButtonRef?.current?.getBoundingClientRect()
  const topLevel: number = buttonRect?.top ?? 0
  const topOffset: number = buttonRect?.height ?? 0
  const topPosition = topLevel + topOffset
  const leftPosition = buttonRect?.left ?? 0

  return {
    position: 'absolute',
    top: topPosition,
    left: leftPosition,
  }
}
