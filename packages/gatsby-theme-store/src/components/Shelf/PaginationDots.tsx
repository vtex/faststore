import React, { FC, ComponentProps } from 'react'
import { SliderPaginationDots } from '@vtex/store-ui'

type Props = ComponentProps<typeof SliderPaginationDots>

const ShelfPaginationDots: FC<Props> = (props) => (
  <SliderPaginationDots {...props} variant={`shelf.${props.variant}`} />
)

export default ShelfPaginationDots
