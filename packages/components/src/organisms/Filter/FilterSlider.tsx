import React, { PropsWithChildren } from 'react'

import {
  Button,
  ButtonProps,
  SlideOver,
  SlideOverHeader,
  useFadeEffect,
  useUI,
} from '../../'

import { SlideOverDirection, SlideOverWidthSize } from '../SlideOver'

export interface FilterSliderProps {
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
   * Function called when Close Button is clicked.
   */
  onClose: () => void
}

function FilterSlider({
  title,
  size,
  direction,
  children,
  applyBtnProps,
  clearBtnProps,
  onClose,
}: PropsWithChildren<FilterSliderProps>) {
  const { fade, fadeOut } = useFadeEffect()
  const { closeFilter } = useUI()

  return (
    <SlideOver
      data-fs-filter-slider
      isOpen
      fade={fade}
      onDismiss={fadeOut}
      size={size}
      direction={direction}
      onTransitionEnd={() => fade === 'out' && closeFilter()}
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
      <footer data-fs-filter-slider-footer>
        <Button data-fs-filter-slider-footer-button-clear {...clearBtnProps} />
        <Button
          data-fs-filter-slider-footer-button-apply
          data-testid="filter-slider-button-apply"
          {...applyBtnProps}
          onClick={(e) => {
            applyBtnProps?.onClick?.(e)
            fadeOut()
          }}
        />
      </footer>
    </SlideOver>
  )
}

export default FilterSlider
