import React from 'react'
import { IconProps } from './IconProps'

// Icon from Phosphor Icons
const Truck = ({ size = 24 }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 256 256"
    strokeWidth="16"
    width={size}
    height={size}
  >
    <rect width="256" height="256" fill="none"></rect>
    <path
      d="M240,120H176V80h42.58374a8,8,0,0,1,7.42781,5.02887Z"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <line
      x1="16"
      y1="144"
      x2="176"
      y2="144"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></line>
    <circle
      cx="188"
      cy="192"
      r="24"
      fill="none"
      stroke="currentColor"
      strokeMiterlimit="10"
    ></circle>
    <circle
      cx="68"
      cy="192"
      r="24"
      fill="none"
      stroke="currentColor"
      strokeMiterlimit="10"
    ></circle>
    <line
      x1="164"
      y1="192"
      x2="92"
      y2="192"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></line>
    <path
      d="M44,192H24a8,8,0,0,1-8-8V72a8,8,0,0,1,8-8H176V171.21508"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M176,171.21508V120h64v64a8,8,0,0,1-8,8H212"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
)

export default Truck
