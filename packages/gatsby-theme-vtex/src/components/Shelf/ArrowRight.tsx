import React, { FC } from 'react'
import { Button } from '@vtex/store-ui'

interface Props {
  onClick: () => void
}

const ShelfArrowRight: FC<Props> = ({ onClick }) => (
  <Button
    onClick={onClick}
    aria-label="See shelf next page"
    backgroundColor="transparent"
    color="black"
  >
    <svg
      fill="none"
      width="25"
      height="25"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <use href="#nav-thin-caret--right" xlinkHref="#nav-thin-caret--right">
        <g id="nav-thin-caret--right">
          <path
            d="M5 15L12 8L5 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </use>
    </svg>
  </Button>
)

export default ShelfArrowRight
