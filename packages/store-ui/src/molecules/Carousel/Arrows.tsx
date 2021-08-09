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
      d="M11 1L4 8L11 15"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke={color}
      fill="none"
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
      d="M5 15L12 8L5 1"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke={color}
      fill="none"
    />
  </svg>
)
