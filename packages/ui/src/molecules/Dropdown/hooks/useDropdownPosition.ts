import { useDropdown } from '../contexts/DropdownContext'

type DropdownPosition = {
  position: 'absolute'
  top: number
  left: number
}

export const useDropdownPosition = (): DropdownPosition => {
  const { buttonDropdownRef } = useDropdown()

  const topLevel = buttonDropdownRef?.current?.offsetTop ?? 0
  const topOffset = buttonDropdownRef?.current?.offsetHeight ?? 0
  const topPosition = topLevel + topOffset
  const leftPosition = buttonDropdownRef?.current?.offsetLeft ?? 0

  return {
    position: 'absolute',
    top: topPosition,
    left: leftPosition,
  }
}
