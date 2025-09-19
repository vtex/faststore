import { SlideOverHeader } from '../..'
import type { SlideOverHeaderProps } from '../..'

export interface NavbarSliderHeaderProps extends SlideOverHeaderProps {
  /**
   * ID to find this component in testing tools (e.g.: Testing Library, and Jest).
   */
  testId?: string
}

export default function NavbarSliderHeader({
  children,
  testId = 'fs-navbar-slider-header',
  ...otherProps
}: NavbarSliderHeaderProps) {
  return (
    <SlideOverHeader
      data-fs-navbar-slider-header
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </SlideOverHeader>
  )
}
