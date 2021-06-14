import React from 'react'
import { Box } from 'theme-ui'
import type { FC } from 'react'
import type { ButtonProps } from 'theme-ui'

type Props = Omit<ButtonProps, 'ref'>

const svgProps = {
  fill: 'none',
  width: '25',
  height: '25',
  viewBox: '0 0 16 16',
  xmlns: 'http://www.w3.org/2000/svg',
  xmlnsXlink: 'http://www.w3.org/1999/xlink',
}

const SliderArrowRight: FC<Props> = (props: any) => (
  <Box {...props} as="button" variant={`${props.variant}.arrow.right.button`}>
    <Box as="svg" {...svgProps} variant={`${props.variant}.arrow.right.svg`}>
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
    </Box>
  </Box>
)

export default SliderArrowRight
