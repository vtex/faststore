import { useDropdown } from './useDropdown'

type DropdownPosition = Pick<React.CSSProperties, 'position' | 'top' | 'left'>

/**
 * Hook used to find the DropdownMenu position in relation to DropdownButton
 * @returns Style with positions.
 */
export const useDropdownPosition = (): DropdownPosition => {
  const { dropdownButtonRef } = useDropdown()

  // Necessary to use this component in SSR
  const isBrowser = typeof window !== 'undefined'

  const buttonRect = dropdownButtonRef?.current?.getBoundingClientRect()
  const topLevel = buttonRect?.top ?? 0
  const topOffset = buttonRect?.height ?? 0
  const leftLevel = buttonRect?.left ?? 0

  // The scroll properties fix the position of DropdownMenu when the scroll is activated.
  const scrollTop = isBrowser ? document?.documentElement?.scrollTop : 0
  const scrollLeft = isBrowser ? document?.documentElement?.scrollLeft : 0

  const topPosition = topLevel + topOffset + scrollTop

  const leftPosition = leftLevel + scrollLeft

  return {
    position: 'absolute',
    top: topPosition,
    left: leftPosition,
  }
}
