import React, { FC } from 'react'
import { Button, Box } from '@vtex/store-ui'

interface Props {
  onClick: () => void
  variant: string
}

const svgProps = {
  fill: 'none',
  width: '25',
  height: '25',
  viewBox: '0 0 16 16',
  xmlns: 'http://www.w3.org/2000/svg',
  xmlnsXlink: 'http://www.w3.org/1999/xlink',
}

const ShelfArrowLeft: FC<Props> = ({ onClick, variant }) => (
  <Button
    variant={`${variant}.leftArrow.button`}
    onClick={onClick}
    aria-label="See shelf previous page"
    backgroundColor="transparent"
    color="black"
  >
    <Box as="svg" variant={`${variant}.leftArrow.svg`} {...svgProps}>
      <use href="#nav-thin-caret--left" xlinkHref="#nav-thin-caret--left">
        <g id="nav-thin-caret--left">
          <path
            d="M11 1L4 8L11 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </use>
    </Box>
  </Button>
)

export default ShelfArrowLeft
