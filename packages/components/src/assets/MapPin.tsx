import React from 'react'
import { IconProps } from './IconProps'

// Icon from Phosphor Icons
const MapPin = ({ size = 24 }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
  >
    <path fill="none" d="M0 0h256v256H0z" />
    <circle
      cx="128"
      cy="104"
      r="32"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="16"
    />
    <path
      d="M208 104c0 72-80 128-80 128s-80-56-80-128a80 80 0 0 1 160 0Z"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="16"
    />
  </svg>
)

export default MapPin
