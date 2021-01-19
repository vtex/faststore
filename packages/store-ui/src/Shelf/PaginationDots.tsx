import React from 'react'
import type { FC, ComponentProps } from 'react'

import SliderPaginationDots from '../Slider/PaginationDots'

type Props = ComponentProps<typeof SliderPaginationDots>

const ShelfPaginationDots: FC<Props> = (props) => (
  <SliderPaginationDots {...props} variant={`shelf.${props.variant}`} />
)

export default ShelfPaginationDots
