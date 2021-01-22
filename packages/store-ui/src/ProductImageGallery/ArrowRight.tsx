import React from 'react'
import type { ComponentProps, FC } from 'react'

import { SliderArrowRight } from '../index'

type Props = ComponentProps<typeof SliderArrowRight>

const CarouselArrowRight: FC<Props> = (props) => (
  <SliderArrowRight
    backgroundColor="transparent"
    color="black"
    aria-label="Next Product Image"
    {...props}
  />
)

export default CarouselArrowRight
