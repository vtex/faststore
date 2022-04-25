import { Modal as UIModal } from '@faststore/ui'
import { useEffect } from 'react'
import type { ReactNode, HTMLAttributes } from 'react'

import { useModal } from 'src/sdk/ui/modal/Provider'

type Direction = 'leftSide' | 'rightSide'
type WidthSize = 'full' | 'partial'

interface SlideOverProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  direction: Direction
  size: WidthSize
  children: ReactNode
  /**
   * This function is called whenever the user clicks outside
   * the modal content
   */
  onDismiss?: () => void
}

const SlideOver = ({
  isOpen,
  onDismiss,
  direction = 'leftSide',
  size = 'full',
  children,
  ...otherProps
}: SlideOverProps) => {
  const { fade, onModalOpen, onModalClose } = useModal()

  useEffect(() => {
    isOpen && onModalOpen()
  }, [isOpen, onModalOpen])

  return (
    <UIModal
      isOpen={isOpen}
      onDismiss={(e) => {
        e.preventDefault()
        onModalClose()
      }}
      data-slide-over
      data-slide-over-direction={direction}
      data-slide-over-size={size}
      data-slide-over-state={fade}
      onTransitionEnd={() => fade === 'out' && onDismiss?.()}
      {...otherProps}
    >
      {children}
    </UIModal>
  )
}

export default SlideOver
