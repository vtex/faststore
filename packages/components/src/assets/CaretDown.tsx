import React from 'react'
import type { FC } from 'react'

// Icon from Phosphor Icons
const CaretDown: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 256 256"
    strokeWidth="16"
    width={24}
    height={24}
  >
    <rect width="256" height="256" fill="none"></rect>
    <polyline
      points="208 96 128 176 48 96"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="24"
    ></polyline>
  </svg>
)

export default CaretDown
