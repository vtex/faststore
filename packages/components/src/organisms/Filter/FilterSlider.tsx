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
   * Props for the Clear Button from FilterSlider component.
   */
  clearBtnProps?: Partial<ButtonProps>
  /**
   * Props for the Apply Button from FilterSlider component.
   */
  applyBtnProps?: Partial<ButtonProps>
  /**
   * Function called when close button is clicked.
   */
  onClose: () => void
  /**
   * Represents the side that the FilterSlider comes from.
   */
  direction: SlideOverDirection
  /**
   * Represents the size of the FilterSlider.
   */
  size: SlideOverWidthSize
}

function FilterSlider({
  title,
  clearBtnProps,
  applyBtnProps,
  onClose,
  size,
  direction,
  children,
}: PropsWithChildren<FilterSliderProps>) {
  const { closeFilter } = useUI()
  const { fade, fadeOut } = useFadeEffect()

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
