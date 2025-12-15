import React, { type PropsWithChildren } from 'react'
import type { OverlayProps } from '../../atoms/Overlay'
import type { PriceFormatter } from '../../atoms/Price'
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

  /**
   * Formatter function that transforms the raw price value and render the result.
   */
  formatter?: PriceFormatter

  /**
   * Props forwarded to the `QuickOrderDrawerProvider` component.
   */
  providerProps?: Omit<QuickOrderDrawerProviderProps, 'children'>
}

const QuickOrderDrawer = ({
  testId = 'fs-qod',
  isOpen,
  overlayProps,
  providerProps,
  children,
}: PropsWithChildren<QuickOrderDrawerProps>) => {
  const { fade } = useFadeEffect()
  return (
    <QuickOrderDrawerProvider {...providerProps}>
      <SlideOver
        testId={testId}
        fade={fade}
        isOpen={isOpen}
        size="partial"
        direction="rightSide"
        overlayProps={overlayProps}
        data-fs-qod
      >
        {children}
      </SlideOver>
    </QuickOrderDrawerProvider>
  )
}

export default QuickOrderDrawer
