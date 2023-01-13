import React from 'react'
import type { FC } from 'react'

// Icon from Phosphor Icons
const Plus: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 256 256"
    strokeWidth="24"
    width={16}
    height={16}
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
    ></line>
    <line
      x1="128"
      y1="40"
      x2="128"
      y2="216"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></line>
  </svg>
)

export default Plus
