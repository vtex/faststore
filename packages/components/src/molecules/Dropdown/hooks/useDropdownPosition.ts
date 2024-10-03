import { useEffect, useState } from 'react'
import { useDropdown } from './useDropdown'

type DropdownPosition = {
  loading: boolean
} & Pick<React.CSSProperties, 'position' | 'top' | 'left'>

/**
 * Hook used to find the DropdownMenu position in relation to DropdownButton
 * @returns Style with positions.
 */
export const useDropdownPosition = (): DropdownPosition => {
  const { dropdownTriggerRef, isOpen } = useDropdown()

  const [positionProps, setPositionProps] = useState({
    top: 0,
    left: 0,
    loading: true
  })

  useEffect(() => {
    const updateMenuPosition = () => {
      // Necessary to use this component in SSR
      const isBrowser = typeof window !== 'undefined'

      const buttonRect = dropdownTriggerRef?.current?.getBoundingClientRect()
      const topLevel = buttonRect?.top ?? 0
      const topOffset = buttonRect?.height ?? 0
      const leftLevel = buttonRect?.left ?? 0

      // The scroll properties fix the position of DropdownMenu when the scroll is activated.
      const scrollTop = isBrowser ? document?.documentElement?.scrollTop : 0
      const scrollLeft = isBrowser ? document?.documentElement?.scrollLeft : 0

      const topPosition = topLevel + topOffset + scrollTop

      const leftPosition = leftLevel + scrollLeft

      setPositionProps({
        top: topPosition,
        left: leftPosition,
        loading: false
      })
    }

      if (isOpen) {
        // Update the position of the menu
        updateMenuPosition()
        window.addEventListener('resize', updateMenuPosition)
      }

      // Cleanup listener on unmount or close
      return () => {
        window.removeEventListener('resize', updateMenuPosition)
      }
    }
  , [dropdownTriggerRef, isOpen])

  return { ...positionProps, position: 'absolute' as const }
}
