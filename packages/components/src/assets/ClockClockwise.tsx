import React from 'react'
import type { FC } from 'react'

// Icon from Phosphor Icons
const ClockClockwise: FC = () => (
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
      x1="128"
      y1="80"
      x2="128"
      y2="128"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="16"
    ></line>
    <line
      x1="169.6"
      y1="152"
      x2="128"
      y2="128"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="16"
    ></line>
    <polyline
      points="184.2 99.7 224.2 99.7 224.2 59.7"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="16"
    ></polyline>
    <path
      d="M190.2,190.2a88,88,0,1,1,0-124.4l34,33.9"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="16"
    ></path>
  </svg>
)

export default ClockClockwise
