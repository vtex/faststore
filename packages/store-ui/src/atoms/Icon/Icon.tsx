import type { SVGAttributes } from 'react'
import React from 'react'

import icons from './icons'

export interface IconProps extends SVGAttributes<SVGElement> {
  className?: string
  name: 'add_to_cart'
}

const Icon = ({ name, ...props }: IconProps) => {
  const commonProps = {
    'data-store-icon': '',
    ...props,
  }

  const icon = icons[name]

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...commonProps}
    >
      {icon.map((path, key) => (
        <path key={`${name}-${key}`} d={path} />
      ))}
    </svg>
  )
}

export default Icon
