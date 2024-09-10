import React from 'react'
import type { ReactNode, HTMLAttributes } from 'react'
import SlideOver, { SlideOverHeader } from '../SlideOver'
import { SlideOverDirection, SlideOverWidthSize } from '../SlideOver'
import { useFadeEffect } from '../../hooks'
import { OverlayProps } from '../..'

export interface SKUMatrixSidebarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Title for the SKUMatrixSidebar component.
   */
  title?: string
  /**
   * Represents the side that the SKUMatrixSidebar comes from.
   */
  direction?: SlideOverDirection
  /**
   * Represents the size of the SKUMatrixSidebar.
   */
  size?: SlideOverWidthSize
  /**
   * Total of selected item in the Matrix.
   */
  // totalitems: number
  /**
   * A React component that will be rendered as an icon on the Alert component.
   */
  alertIcon?: ReactNode
  /**
   * The content for Alert component.
   */
  alertText?: string
  /**
   * Props forwarded to the `Overlay` component.
   */
  overlayProps?: OverlayProps
  /**
   * Show slide over.
   */
  isOpen: boolean
  /**
   * Function called when Close Button is clicked.
   */
  onClose: () => void
}

function SKUMatrixSidebar({
  direction = 'rightSide',
  title,
  overlayProps,
  size = 'full',
  isOpen,
  children,
  // totalitems = 0,
  onClose,
  ...otherProps
}: SKUMatrixSidebarProps) {
  const { fade } = useFadeEffect()

  return (
    <SlideOver
      data-fs-sku-matrix-sidebar
      isOpen={isOpen}
      fade={fade}
      size={size}
      direction={direction}
      overlayProps={overlayProps}
      {...otherProps}
    >
      <SlideOverHeader
        onClose={() => {
          onClose()
        }}
        data-fs-sku-matrix-sidebar-title
      >
        <h2>{title}</h2>
      </SlideOverHeader>

      {children}
    </SlideOver>
  )
}

export default SKUMatrixSidebar
