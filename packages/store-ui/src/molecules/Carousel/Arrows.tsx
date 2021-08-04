import React from 'react'

interface IconProps {
  size?: {
    width: number
    height: number
  }
  viewBox?: string
  color?: string
}

export const LeftArrowIcon = ({
  size = { width: 25, height: 25 },
  viewBox = '0 0 16 16',
  color = 'currentColor',
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox={viewBox}
    width={size.width}
    height={size.height}
  >
    <path
      d="M7.72356 8.48154C7.32958 8.89452 6.67042 8.89452 6.27644 8.48154L0 1.90235L1.81481 0L7 5.43529L12.1852 0L14 1.90235L7.72356 8.48154Z"
      transform="translate(9.23999) rotate(90)"
      fill={color}
    />
  </svg>
)

export const RightArrowIcon = ({
  size = { width: 25, height: 25 },
  viewBox = '0 0 16 16',
  color = 'currentColor',
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox={viewBox}
    width={size.width}
    height={size.height}
  >
    <path
      d="M7.72356 8.48154C7.32958 8.89452 6.67042 8.89452 6.27644 8.48154L0 1.90235L1.81481 0L7 5.43529L12.1852 0L14 1.90235L7.72356 8.48154Z"
      transform="translate(0 14) rotate(-90)"
      fill={color}
    />
  </svg>
)
