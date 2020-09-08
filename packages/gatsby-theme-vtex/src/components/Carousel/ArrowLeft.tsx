/** @jsx jsx */
import { Button, jsx } from '@vtex/store-ui'
import { FC } from 'react'

interface Props {
  onClick: () => void
}

const CarouselArrowLeft: FC<Props> = ({ onClick }) => (
  <Button
    onClick={onClick}
    sx={{ position: 'absolute', top: '50%', left: 0, zIndex: 1 }}
    backgroundColor="transparent"
    color="black"
    aria-label="Previous Carousel Image"
  >
    <svg
      fill="none"
      width="25"
      height="25"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
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
    </svg>
  </Button>
)

export default CarouselArrowLeft
