import type { SVGProps } from 'react'

type IconWeight = 'thin' | 'light' | 'regular' | 'bold'

const mapWeightToValue: Record<IconWeight, number> = {
  bold: 24,
  regular: 16,
  light: 12,
  thin: 8,
}

interface Props extends SVGProps<SVGSVGElement> {
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
}

function Icon({ name, weight = 'regular', ...otherProps }: Props) {
  return (
    <svg {...otherProps} strokeWidth={mapWeightToValue[weight]}>
      <use href={`/icons.svg#${name}`} />
    </svg>
  )
}

export default Icon
