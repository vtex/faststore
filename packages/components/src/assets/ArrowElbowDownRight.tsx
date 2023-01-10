import React from 'react'
import type { FC } from 'react'

// Icon from Phosphor Icons
const ArrowElbowDownRight: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 256 256" 
    fill="currentColor"
    strokeWidth="16"
    width={24}
    height={24}
  >
    <rect width="256" height="256" fill="none"></rect>
    <polyline 
      points="160 128 208 176 160 224" 
      fill="none" 
      stroke="currentColor" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="16"
    ></polyline>
    <polyline 
      points="64 32 64 176 208 176" 
      fill="none" 
      stroke="currentColor" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="16"
    ></polyline>
  </svg>
)

export default ArrowElbowDownRight
