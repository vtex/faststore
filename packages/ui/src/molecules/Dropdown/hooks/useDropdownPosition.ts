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

  const topLevel = dropdownButtonRef?.current?.offsetTop ?? 0
  const topOffset = dropdownButtonRef?.current?.offsetHeight ?? 0
  const topPosition = topLevel + topOffset
  const leftPosition = dropdownButtonRef?.current?.offsetLeft ?? 0

  return {
    position: 'absolute',
    top: topPosition,
    left: leftPosition,
  }
}
