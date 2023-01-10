import React from 'react'
import type { FC } from 'react'

// Icon from Phosphor Icons
const XCircle: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 256 256"
    strokeWidth="16"
    width={20}
    height={20}
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
      x1="160"
      y1="96"
      x2="96"
      y2="160"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></line>
    <line
      x1="160"
      y1="160"
      x2="96"
      y2="96"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></line>
  </svg>
)

export default XCircle
