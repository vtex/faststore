import React, { FC } from 'react'
import { Box } from 'theme-ui'

interface Props {
  isActive: boolean
}

const ArrowUp = (
  <Box variant="facet.collapsible.header.icon">
    <svg
      height="38px"
      width="38px"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g transform="translate(11, 11)">
        <path
          d="M7.26254 2.80524C7.65892 2.37243 8.34108 2.37243 8.73746 2.80525L16 10.7353L13.9259 13L8 6.52941L2.07407 13L0 10.7353L7.26254 2.80524Z"
          fill="currentColor"
        />
      </g>
    </svg>
  </Box>
)

const ArrowDown = (
  <Box variant="facet.collapsible.header.icon">
    <svg
      height="38px"
      width="38px"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g transform="translate(11, 11)">
        <path
          d="M8.73746 13.1948C8.34108 13.6276 7.65892 13.6276 7.26254 13.1948L0 5.26471L2.07407 3L8 9.47059L13.9259 3L16 5.26471L8.73746 13.1948Z"
          fill="currentColor"
        />
      </g>
    </svg>
  </Box>
)

const GroupCollapsibleIcon: FC<Props> = ({ isActive }) =>
  isActive ? ArrowUp : ArrowDown

export default GroupCollapsibleIcon
