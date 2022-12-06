import React from 'react'

// Icon from Phosphor Icons
const XCircle = () => {
  return (
    <symbol
      id="XCircle"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 256 256"
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
    </symbol>
  )
}

export default XCircle
