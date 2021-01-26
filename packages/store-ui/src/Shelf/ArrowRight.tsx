import React from 'react'
import type { ComponentProps, FC } from 'react'

import SliderArrowRight from '../Slider/ArrowRight'

type Props = ComponentProps<typeof SliderArrowRight>

const ShelfArrowRight: FC<Props> = ({ variant, ...rest }) => (
  <SliderArrowRight
    variant={`shelf.${variant}`}
    aria-label="See shelf next page"
    {...rest}
  />
)

export default ShelfArrowRight
