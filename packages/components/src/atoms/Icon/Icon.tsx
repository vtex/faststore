import type { SVGProps } from 'react'
import React, { forwardRef } from 'react'

type IconWeight = 'thin' | 'light' | 'regular' | 'bold'

const mapWeightToValue: Record<IconWeight, number> = {
  bold: 24,
  regular: 16,
  light: 12,
  thin: 8,
}

export interface IconProps extends SVGProps<SVGSVGElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Symbol id from element to render. Take a look at `/static/icons.svg`.
   *
   * Example: <Icon name="Bell" />
   */
  name: string
  /**
   * SVG weight.
   *
   * @default 'regular'
   */
  weight?: IconWeight
  /**
   * SVG width.
   *
   * @default '24'
   */
  width?: number
  /**
   * SVG height.
   *
   * @default '24'
   */
  height?: number
}

const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { testId = 'fs-icon', name, weight = 'regular', ...otherProps }: IconProps,
  ref
) {
  const { width, height } = otherProps
  return (
    <svg
      ref={ref}
      data-fs-icon
      data-testid={testId}
      width={width ?? 24}
      height={height ?? 24}
      strokeWidth={mapWeightToValue[weight]}
      {...otherProps}
    >
      <use href={`/icons.svg#${name}`} />
    </svg>
  )
})

export default Icon
