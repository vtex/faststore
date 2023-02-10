import React from 'react'
import { ItemProps } from './ItemProps'

// Icon from Phosphor Icons
const ArrowElbowDownRight = ({ size  = 24 }: ItemProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 256 256" 
    fill="currentColor"
    strokeWidth="16"
    width={size}
    height={size}
  >
    <rect width="256" height="256" fill="none"></rect>
    <polyline 
      points="160 128 208 176 160 224" 
      fill="none" 
      stroke="currentColor"
    ></polyline>
    <polyline 
      points="64 32 64 176 208 176" 
      fill="none" 
      stroke="currentColor" 
    ></polyline>
  </svg>
)

export default ArrowElbowDownRight
