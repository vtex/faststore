import React from 'react'
import type { FC } from 'react'

// Icon from Phosphor Icons
const MinusCircle: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 256 256"
    strokeWidth="16"
    width={24}
    height={24}
  >
    <rect width="256" height="256" fill="none"></rect>
    <circle
      cx="128"
      cy="128"
      r="96"
      fill="none"
      stroke="currentColor"
      strokeMiterlimit="10"
    ></circle>
    <line
      x1="88"
      y1="128"
      x2="168"
      y2="128"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></line>
  </svg>
)

export default MinusCircle
