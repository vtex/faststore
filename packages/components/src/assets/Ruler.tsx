import React from 'react'
import type { FC } from 'react'

// Icon from Phosphor Icons
const Ruler: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 256 256"
    strokeWidth="16"
    width={24}
    height={24}
  >
    <rect width="256" height="256" fill="none"></rect>
    <rect
      x="26.2"
      y="82.7"
      width="203.6"
      height="90.51"
      rx="8"
      transform="translate(-53 128) rotate(-45)"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="24"
    ></rect>
    <line
      x1="132"
      y1="60"
      x2="164"
      y2="92"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="24"
    ></line>
    <line
      x1="96"
      y1="96"
      x2="128"
      y2="128"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="24"
    ></line>
    <line
      x1="60"
      y1="132"
      x2="92"
      y2="164"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="24"
    ></line>
  </svg>
)

export default Ruler
