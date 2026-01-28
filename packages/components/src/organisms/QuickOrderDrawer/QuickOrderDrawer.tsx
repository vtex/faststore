import React, { type PropsWithChildren } from 'react'
import type { OverlayProps } from '../../atoms/Overlay'
import type { PriceFormatter } from '../../atoms/Price'
import { useFadeEffect } from '../../hooks'
import SlideOver from '../SlideOver/SlideOver'

import {
  type Product,
  QuickOrderDrawerProvider,
} from './provider/QuickOrderDrawerProvider'

export type QuickOrderDrawerProps = {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string

  /**
   * Controls the state
   */
  isOpen: boolean

  /**
   * Props forwarded to the `Overlay` component.
   */
  overlayProps?: OverlayProps

  /**
   * Formatter function that transforms the raw price value and render the result.
   */
  formatter?: PriceFormatter

  /**
   * Initial alert message for CMS configuration
   */
  initialAlertMessage?: string

  /**
   * Initial products for the Quick Order Drawer
   */
  initialProducts?: Product[]
}

const QuickOrderDrawer = ({
  testId = 'fs-quick-order-drawer',
  isOpen,
  overlayProps,
  formatter,
  initialAlertMessage,
  initialProducts,
  children,
}: PropsWithChildren<QuickOrderDrawerProps>) => {
  const { fade } = useFadeEffect()
  return (
    <QuickOrderDrawerProvider
      formatter={formatter}
      initialAlertMessage={initialAlertMessage}
      initialProducts={initialProducts}
    >
      <SlideOver
        testId={testId}
        fade={fade}
        isOpen={isOpen}
        size="partial"
        direction="rightSide"
        overlayProps={overlayProps}
        data-fs-quick-order-drawer
      >
        {children}
      </SlideOver>
    </QuickOrderDrawerProvider>
  )
}

export default QuickOrderDrawer
