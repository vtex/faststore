import React from 'react'
import type { ComponentProps, FC } from 'react'

import SliderArrowRight from '../../Slider/ArrowRight'

type Props = ComponentProps<typeof SliderArrowRight>

const CarouselArrowRight: FC<Props> = (props) => (
  <SliderArrowRight aria-label="Next Carousel Image" {...props} />
)

export default CarouselArrowRight
