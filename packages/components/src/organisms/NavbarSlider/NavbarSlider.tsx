import React from 'react'

import { SlideOver } from '../..'
import type { SlideOverProps } from '../..'

type RequiredSliderOverProps = 'isOpen' | 'direction' | 'size'

export interface NavbarSliderProps
  extends Omit<SlideOverProps, RequiredSliderOverProps> {
  /**
   * A boolean value that represents the state of the slider.
   */
  isOpen?: SlideOverProps['isOpen']
  /**
   * Represents the side that the slider comes from.
   */
  direction?: SlideOverProps['direction']
  /**
   * Represents the size of the slider.
   */
  size?: SlideOverProps['size']
}

function NavbarSlider({
  children,
  size = 'full',
  isOpen = true,
  direction = 'leftSide',
  testId = 'fs-navbar-slider',
  ...otherProps
}: NavbarSliderProps) {
  return (
    <SlideOver
      data-fs-navbar-slider
      size={size}
      isOpen={isOpen}
      direction={direction}
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </SlideOver>
  )
}

export default NavbarSlider
