import React from 'react'
import { IconProps } from './IconProps'

// Icon from Phosphor Icons
const DotsThree = ({ size = 24 }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 256 256"
    strokeWidth="16"
    width={size}
    height={size}
  >
    <rect width="256" height="256" fill="none"></rect>
    <circle cx="128" cy="128" r="12"></circle>
    <circle cx="192" cy="128" r="12"></circle>
    <circle cx="64" cy="128" r="12"></circle>
  </svg>
)

export default DotsThree
