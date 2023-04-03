import React, { PropsWithChildren } from 'react'
import type { ReactNode } from 'react'

import {
  Alert,
  Badge,
  SlideOver,
  SlideOverHeader,
  useFadeEffect,
  useUI,
} from '../../'

import { SlideOverDirection, SlideOverWidthSize } from '../SlideOver'

export interface CartSidebarProps {
  /**
   * Title for the FilterSlider component.
   */
  title?: string
  /**
   * Represents the side that the FilterSlider comes from.
   */
  direction: SlideOverDirection
  /**
   * Represents the size of the FilterSlider.
   */
  size: SlideOverWidthSize
  /**
   * Total of item in the Cart.
   */
  totalItems: number
  /**
   * Function called when Close Button is clicked.
   */
  onClose: () => void
  /**
   * A React component that will be rendered as an icon on the Alert component (e.g.: a <Truck /> component).
   */
  alertIcon?: ReactNode
  /**
   * The content for Alert component.
   */
  alertText?: string
}

function CartSidebar({
  title = 'Your Cart',
  size = 'partial',
  direction = 'rightSide',
  totalItems,
  children,
  onClose,
  alertIcon,
  alertText,
}: PropsWithChildren<CartSidebarProps>) {
  const { fade, fadeOut } = useFadeEffect()
  const { closeFilter } = useUI()

  return (
    <SlideOver
      data-fs-cart-sidebar
      isOpen
      fade={fade}
      onDismiss={fadeOut}
      size={size}
      direction={direction}
      onTransitionEnd={() => fade === 'out' && closeFilter()}
    >
      <SlideOverHeader
        onClose={() => {
          onClose()
          fadeOut()
        }}
      >
        <h2 data-fs-cart-sidebar-title>
          {title}
          <Badge variant="info">{totalItems}</Badge>
        </h2>
      </SlideOverHeader>

      {alertText && <Alert icon={alertIcon}>{alertText}</Alert>}
      {children}
    </SlideOver>
  )
}

export default CartSidebar
