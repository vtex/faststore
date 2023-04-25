import type { HTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import React from 'react'

import {
  Alert,
  Badge,
  OverlayProps,
  SlideOver,
  SlideOverHeader,
  useFadeEffect,
  useUI,
} from '../../'

import { SlideOverDirection, SlideOverWidthSize } from '../SlideOver'

export interface CartSidebarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Title for the CartSidebar component.
   */
  title?: string
  /**
   * Represents the side that the CartSidebar comes from.
   */
  direction?: SlideOverDirection
  /**
   * Represents the size of the CartSidebar.
   */
  size?: SlideOverWidthSize
  /**
   * Total of item in the Cart.
   */
  totalItems: number
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
   * Function called when Close Button is clicked.
   */
  onClose: () => void
}

function CartSidebar({
  testId = 'fs-cart-sidebar',
  title = 'Your Cart',
  size = 'partial',
  direction = 'rightSide',
  totalItems,
  children,
  alertIcon,
  alertText,
  overlayProps,
  onClose,
  ...otherProps
}: PropsWithChildren<CartSidebarProps>) {
  const { fade, fadeOut } = useFadeEffect()
  const { closeCart } = useUI()

  return (
    <SlideOver
      data-fs-cart-sidebar
      isOpen
      fade={fade}
      onDismiss={fadeOut}
      size={size}
      direction={direction}
      onTransitionEnd={() => fade === 'out' && closeCart()}
      testId={testId}
      overlayProps={overlayProps}
      {...otherProps}
    >
      <SlideOverHeader
        closeBtnProps={{ testId: 'fs-cart-sidebar-button-close' }}
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
