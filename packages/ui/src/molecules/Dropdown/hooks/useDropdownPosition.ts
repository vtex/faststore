import { useDropdown } from './useDropdown'

type DropdownPosition = Pick<React.CSSProperties, 'position' | 'top' | 'left'>

/**
 * Hook used to find the DropdownMenu position in relation to DropdownButton
 * @returns Style with positions.
 */
export const useDropdownPosition = (): DropdownPosition => {
  const { dropdownButtonRef } = useDropdown()

  const buttonRect = dropdownButtonRef?.current?.getBoundingClientRect()
  const topLevel: number = buttonRect?.top ?? 0
  const topOffset: number = buttonRect?.height ?? 0

  // The scroll properties fix the position of DropdownMenu when the scroll is activated.
  const topPosition = topLevel + topOffset + document.documentElement.scrollTop
  const leftLevel = buttonRect?.left ?? 0
  const leftPosition = leftLevel + document.documentElement.scrollLeft

  return {
    position: 'absolute',
    top: topPosition,
    left: leftPosition,
  }
}
