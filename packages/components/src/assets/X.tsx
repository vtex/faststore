import React from 'react'
import type { FC } from 'react'

// Icon from Phosphor Icons
const X: FC = () => (
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
      x1="200"
      y1="56"
      x2="56"
      y2="200"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></line>
    <line
      x1="200"
      y1="200"
      x2="56"
      y2="56"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></line>
  </svg>
)

export default X
