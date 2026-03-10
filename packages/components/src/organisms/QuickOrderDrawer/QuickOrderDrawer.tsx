import React, { type PropsWithChildren } from 'react'
import type { OverlayProps } from '../../atoms/Overlay'
import { useFadeEffect } from '../../hooks'
import SlideOver from '../SlideOver/SlideOver'

import {
  QuickOrderDrawerProvider,
  type QuickOrderDrawerProviderProps,
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
} & Omit<QuickOrderDrawerProviderProps, 'children'>

const QuickOrderDrawer = ({
  testId = 'fs-quick-order-drawer',
  isOpen,
  overlayProps,
  children,
  initialAlertMessage,
  initialProducts,
}: PropsWithChildren<QuickOrderDrawerProps>) => {
  const { fade } = useFadeEffect()
  return (
    <QuickOrderDrawerProvider
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
