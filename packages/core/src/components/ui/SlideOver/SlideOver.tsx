import { Modal as UIModal } from '@faststore/ui'
import type { ReactNode, HTMLAttributes } from 'react'

type Direction = 'leftSide' | 'rightSide'
type WidthSize = 'full' | 'partial'

interface SlideOverProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  direction: Direction
  size: WidthSize
  children: ReactNode
  fade: 'in' | 'out'
  /**
   * This function is called whenever the user clicks outside
   * the modal content
   */
  onDismiss?: () => void
}

function SlideOver({
  isOpen,
  direction = 'leftSide',
  size = 'full',
  fade = 'out',
  children,
  ...otherProps
}: SlideOverProps) {
  return (
    <UIModal
      isOpen={isOpen}
      data-slide-over
      data-slide-over-direction={direction}
      data-slide-over-size={size}
      data-slide-over-state={fade}
      {...otherProps}
    >
      {children}
    </UIModal>
  )
}

export default SlideOver
