import type { HTMLAttributes, PropsWithChildren } from 'react'
import React from 'react'

import {
  Button,
  type ButtonProps,
  type OverlayProps,
  SlideOver,
  SlideOverHeader,
  useFadeEffect,
  useUI,
} from '../../'

import type { SlideOverDirection, SlideOverWidthSize } from '../SlideOver'

export interface FilterSliderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
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
   * Props for the Apply Button from FilterSlider component.
   */
  applyBtnProps?: Partial<ButtonProps>
  /**
   * Props for the Clear Button from FilterSlider component.
   */
  clearBtnProps?: Partial<ButtonProps>
  /**
   * Props forwarded to the `Overlay` component.
   */
  overlayProps?: OverlayProps
  /**
   * Function called when Close Button is clicked.
   */
  onClose: () => void
  /**
   * Display FilterSlider footer with buttons.
   * @default true
   */
  footer?: boolean
}

function FilterSlider({
  testId = 'fs-filter-slider',
  title,
  size,
  direction,
  children,
  applyBtnProps,
  clearBtnProps,
  overlayProps,
  onClose,
  footer = true,
  ...otherProps
}: PropsWithChildren<FilterSliderProps>) {
  const { fade, fadeOut } = useFadeEffect()
  const { closeFilter, closeRegionSlider } = useUI()

  return (
    <SlideOver
      data-fs-filter-slider
      isOpen
      fade={fade}
      onDismiss={fadeOut}
      size={size}
      direction={direction}
      onTransitionEnd={() => {
        if (fade === 'out') {
          closeFilter()
          closeRegionSlider()
        }
      }}
      testId={testId}
      overlayProps={overlayProps}
      {...otherProps}
    >
      <div data-fs-filter-slider-content>
        <SlideOverHeader
          onClose={() => {
            onClose()
            fadeOut()
          }}
        >
          <h2 data-fs-filter-slider-title>{title}</h2>
        </SlideOverHeader>
        {children}
      </div>
      {footer && (
        <footer data-fs-filter-slider-footer>
          {clearBtnProps && (
            <Button
              data-fs-filter-slider-footer-button-clear
              {...clearBtnProps}
            />
          )}
          {applyBtnProps && (
            <Button
              data-fs-filter-slider-footer-button-apply
              testId={`${testId}-button-apply`}
              {...applyBtnProps}
              onClick={(e) => {
                applyBtnProps?.onClick?.(e)
                fadeOut()
              }}
            />
          )}
        </footer>
      )}
    </SlideOver>
  )
}

export default FilterSlider
