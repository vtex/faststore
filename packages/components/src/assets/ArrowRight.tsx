import React from 'react'
import type { FC } from 'react'

// Icon from Phosphor Icons
const ArrowRight: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 256 256"
    strokeWidth="16"
    width={24}
    height={24}
  >
    <rect width="256" height="256" fill="none"></rect>
    <line
      x1="40"
      y1="128"
      x2="216"
      y2="128"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="24"
    ></line>
    <polyline
      points="144 56 216 128 144 200"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="24"
    ></polyline>
  </svg>
)

export default ArrowRight
