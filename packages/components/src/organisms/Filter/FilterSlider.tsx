import {
  Button,
  ButtonProps,
  SlideOver,
  SlideOverHeader,
  useFadeEffect,
  useUI,
} from '../../'

import React, { PropsWithChildren, ReactNode } from 'react'
import { SlideOverDirection, SlideOverWidthSize } from '../SlideOver'

export interface FilterSliderProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
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
  onClose: () => void
  size: SlideOverWidthSize
  direction: SlideOverDirection
  children: ReactNode
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
          <h2 className="text__lead">{title}</h2>
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
