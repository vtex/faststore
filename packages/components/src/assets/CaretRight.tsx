import React from 'react'
import { IconProps } from './IconProps'

// Icon from Phosphor Icons
const CaretRight = ({ size = 24 }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 256 256"
    strokeWidth="16"
    width={size}
    height={size}
  >
    <rect width="256" height="256" fill="none"></rect>
    <polyline
      points="96 48 176 128 96 208"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></polyline>
  </svg>
)

export default CaretRight
