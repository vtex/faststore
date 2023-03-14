import React from 'react'
import type { ReactNode } from 'react'

import { Modal } from '../../'
import type { ModalProps } from '../../'

type Direction = 'leftSide' | 'rightSide'
type WidthSize = 'full' | 'partial'

export type SlideOverProps = Omit<ModalProps, 'title'> & {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * A boolean value that represents the state of the SlideOver
   */
  isOpen: boolean
  /**
   * Represents the side that the SlideOver comes from.
   */
  direction: Direction
  /**
   * Represents the size of the SlideOver.
   */
  size: WidthSize
  /**
   * Represents the fade effect of the SlideOver.
   */
  fade: 'in' | 'out'
  /**
   * This function is called whenever the user clicks outside.
   * the modal content
   */
  onDismiss?: () => void
  children: ReactNode
}

function SlideOver({
  isOpen,
  direction = 'leftSide',
  size = 'full',
  fade = 'out',
  children,
  onDismiss,
  testId = 'fs-slide-over',
  ...otherProps
}: SlideOverProps) {
  return (
    <Modal
      data-fs-modal={null}
      data-fs-slide-over
      data-fs-slide-over-direction={direction}
      data-fs-slide-over-size={size}
      data-fs-slide-over-state={fade}
      isOpen={isOpen}
      onDismiss={onDismiss}
      {...otherProps}
    >
      {children}
    </Modal>
  )
}

export default SlideOver
