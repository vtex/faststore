import React, { ComponentProps, FC } from 'react'
import { SliderArrowLeft } from '@vtex/store-ui'

type Props = ComponentProps<typeof SliderArrowLeft>

const ShelfArrowLeft: FC<Props> = ({ variant, ...rest }) => (
  <SliderArrowLeft
    variant={`shelf.${variant}`}
    aria-label="See shelf previous page"
    {...rest}
  />
)

export default ShelfArrowLeft
