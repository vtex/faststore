import React, { ComponentProps, FC } from 'react'
import { SliderArrowRight } from '@vtex/store-ui'

type Props = ComponentProps<typeof SliderArrowRight>

const ShelfArrowLeft: FC<Props> = ({ variant, ...rest }) => (
  <SliderArrowRight
    variant={`shelf.${variant}`}
    aria-label="See shelf next page"
    {...rest}
  />
)

export default ShelfArrowLeft
