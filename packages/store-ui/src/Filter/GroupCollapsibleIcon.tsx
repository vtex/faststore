import React, { FC } from 'react'
import { Box } from 'theme-ui'

interface Props {
  isActive: boolean
  variant: string
}

const ArrowUp = (
  <path
    d="M7.26254 2.80524C7.65892 2.37243 8.34108 2.37243 8.73746 2.80525L16 10.7353L13.9259 13L8 6.52941L2.07407 13L0 10.7353L7.26254 2.80524Z"
    fill="currentColor"
  />
)

const ArrowDown = (
  <path
    d="M8.73746 13.1948C8.34108 13.6276 7.65892 13.6276 7.26254 13.1948L0 5.26471L2.07407 3L8 9.47059L13.9259 3L16 5.26471L8.73746 13.1948Z"
    fill="currentColor"
  />
)

export const GroupCollapsibleIcon: FC<Props> = ({ isActive, variant }) => (
  <Box variant={`${variant}.icon`}>
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g>{isActive ? ArrowUp : ArrowDown}</g>
    </svg>
  </Box>
)
