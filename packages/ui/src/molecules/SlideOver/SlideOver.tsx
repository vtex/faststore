import React from 'react';

import Modal from '../Modal';

import type { HTMLAttributes, ReactNode } from 'react'

type Direction = 'leftSide' | 'rightSide'

type WidthSize = 'full' | 'partial'

export interface SlideOverProps extends HTMLAttributes<HTMLDivElement> {
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
  children: ReactNode
  /**
   * Represents the fade effect of the SlideOver.
   */
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
    <Modal
      data-fs-slide-over
      data-fs-slide-over-direction={direction}
      data-fs-slide-over-size={size}
      data-fs-slide-over-state={fade}
      isOpen={isOpen}
      {...otherProps}
    >
      {children}
    </Modal>
  )
}

export default SlideOver
