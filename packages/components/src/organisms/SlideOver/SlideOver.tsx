import type { ReactNode } from 'react'
import React from 'react'

import type { ModalProps, OverlayProps } from '../../'
import { Modal } from '../../'

export type Direction = 'leftSide' | 'rightSide'
export type WidthSize = 'full' | 'partial'

export interface SlideOverProps extends Omit<ModalProps, 'title'> {
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
  children: ReactNode
  /**
   * Props forwarded to the `Overlay` component.
   */
  overlayProps?: OverlayProps
  /**
   * This function is called whenever the user clicks outside.
   * the modal content
   */
  onDismiss?: () => void
}

function SlideOver({
  testId = 'fs-slide-over',
  isOpen,
  direction = 'leftSide',
  size = 'full',
  fade = 'out',
  children,
  overlayProps,
  onDismiss,
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
      testId={testId}
      overlayProps={overlayProps}
      {...otherProps}
    >
      {children}
    </Modal>
  )
}

export default SlideOver
