import type { SVGProps } from 'react'
import React, { forwardRef } from 'react'

type IconWeight = 'thin' | 'light' | 'regular' | 'bold'
type IconSize = 20 | 24 | 32

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
   * @deprecated 'weight' prop will be removed in the next major version.
   */
  weight?: IconWeight
  /**
   * SVG width.
   *
   * @default '24'
   * @deprecated 'width' prop will be removed in the next major version. Use 'size' instead.
   */
  width?: number
  /**
   * SVG height.
   *
   * @default '24'
   * @deprecated 'height' prop will be removed in the next major version. Use 'size' instead.
   */
  height?: number
  /**
   * SVG size.
   *
   * @default '20'
   */
  size?: IconSize
}

const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { testId = 'fs-icon', name, weight = 'regular', ...otherProps }: IconProps,
  ref
) {
  let { width, height, size } = otherProps
  let library: string = ''

  if (name.startsWith('fs-')) {
    library = 'material'
    name = `${name}${size ?? 20}`
  }
  else {
    library = 'phosphor'
  }

  return (
    <svg
      ref={ref}
      data-fs-icon
      data-testid={testId}
      size={size ?? 20}
      width={library === 'phosphor' ? width ?? 24 : size ?? 20} // TODO: Remove this after width prop is removed
      height={library === 'phosphor' ? height ?? 24 : size ?? 20} // TODO: Remove this after height prop is removed
      strokeWidth={mapWeightToValue[weight]} // TODO: Remove this after weight prop is removed
      {...otherProps}
    >
      <use href={`/icons.svg#${name}`} />
    </svg>
  )
})

export default Icon
