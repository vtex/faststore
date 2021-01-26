import React from 'react'
import type { ComponentProps, FC } from 'react'

import SliderArrowLeft from '../Slider/ArrowLeft'

type Props = ComponentProps<typeof SliderArrowLeft>

const ShelfArrowLeft: FC<Props> = ({ variant, ...rest }) => (
  <SliderArrowLeft
    variant={`shelf.${variant}`}
    aria-label="See shelf previous page"
    {...rest}
  />
)

export default ShelfArrowLeft
