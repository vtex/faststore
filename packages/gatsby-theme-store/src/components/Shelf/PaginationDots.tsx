import { SliderPaginationDots } from '@vtex/store-ui'
import React from 'react'
import type { FC, ComponentProps } from 'react'

type Props = ComponentProps<typeof SliderPaginationDots>

const ShelfPaginationDots: FC<Props> = (props) => (
  <SliderPaginationDots {...props} variant={`shelf.${props.variant}`} />
)

export default ShelfPaginationDots
