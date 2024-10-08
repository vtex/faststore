import { useEffect, useState } from 'react'
import { useDropdown } from './useDropdown'

type DropdownPosition = {
  loading: boolean
} & Pick<React.CSSProperties, 'position' | 'top' | 'left' | 'right' | 'transform'>

/**
 * Hook used to find the DropdownMenu position in relation to DropdownButton
 * @returns Style with positions.
 */
export const useDropdownPosition = (align: 'left' | 'center' | 'right' = 'left'): DropdownPosition => {
  const { dropdownTriggerRef, isOpen } = useDropdown()

  const [positionProps, setPositionProps] = useState({
    top: 0,
    left: 0 as React.CSSProperties['left'],
    right: 'auto',
    transform: 'none',
    loading: true
  })

  useEffect(() => {
    const updateMenuPosition = () => {
      // Necessary to use this component in SSR
      const isBrowser = typeof window !== 'undefined'

      if (!dropdownTriggerRef?.current) return

      const buttonRect = dropdownTriggerRef.current.getBoundingClientRect()
      const topLevel = buttonRect?.top ?? 0
      const topOffset = buttonRect?.height ?? 0
      const leftLevel = buttonRect?.left ?? 0
      const buttonWidth = buttonRect?.width ?? 0

      // The scroll properties fix the position of DropdownMenu when the scroll is activated.
      const scrollTop = isBrowser ? document?.documentElement?.scrollTop : 0
      const scrollLeft = isBrowser ? document?.documentElement?.scrollLeft : 0

      const topPosition = topLevel + topOffset + scrollTop

      let leftPosition: React.CSSProperties['left'] = leftLevel + scrollLeft
      let rightPosition = 'auto'
      let transform = 'none'

      if (align === 'right') {
        rightPosition = `${document.documentElement.clientWidth - leftLevel - buttonWidth}px`
        leftPosition = 'auto'
      } else if (align === 'center') {
        leftPosition = leftLevel + (buttonWidth / 2) + scrollLeft
        transform = 'translateX(-50%)'
      }

      setPositionProps({
        top: topPosition,
        left: leftPosition,
        right: rightPosition,
        transform,
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
  }, [dropdownTriggerRef, isOpen, align])

  return { ...positionProps, position: 'absolute' as const }
}
