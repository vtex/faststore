import React, { FC } from 'react'
import { Box, ButtonProps } from 'theme-ui'

type Props = Omit<ButtonProps, 'ref'>

const svgProps = {
  fill: 'none',
  width: '25',
  height: '25',
  viewBox: '0 0 16 16',
  xmlns: 'http://www.w3.org/2000/svg',
  xmlnsXlink: 'http://www.w3.org/1999/xlink',
}

const SliderArrowLeft: FC<Props> = (props: any) => (
  <Box {...props} as="button" variant={`${props.variant}.arrow.left.button`}>
    <Box as="svg" {...svgProps} variant={`${props.variant}.arrow.left.svg`}>
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
  </Box>
)

export default SliderArrowLeft
