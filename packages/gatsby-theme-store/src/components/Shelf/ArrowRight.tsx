import { SliderArrowRight } from '@vtex/store-ui'
import React from 'react'
import type { ComponentProps, FC } from 'react'

type Props = ComponentProps<typeof SliderArrowRight>

const ShelfArrowLeft: FC<Props> = ({ variant, ...rest }) => (
  <SliderArrowRight
    variant={`shelf.${variant}`}
    aria-label="See shelf next page"
    {...rest}
  />
)

export default ShelfArrowLeft
