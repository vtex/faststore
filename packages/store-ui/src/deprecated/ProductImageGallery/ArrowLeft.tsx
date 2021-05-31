import React from 'react'
import type { ComponentProps, FC } from 'react'

import SliderArrowLeft from '../Slider/ArrowLeft'

type Props = ComponentProps<typeof SliderArrowLeft>

const CarouselArrowLeft: FC<Props> = (props) => (
  <SliderArrowLeft
    backgroundColor="transparent"
    color="black"
    aria-label="Previous Product Image"
    {...props}
  />
)

export default CarouselArrowLeft
