import React, { ComponentProps, FC } from 'react'
import { LocalizedLink, ResponsivePicture } from '@vtex/store-ui'

export interface Item
  extends Omit<ComponentProps<typeof ResponsivePicture>, 'ref' | 'variant'> {
  href: string
}

interface Props {
  item: Item
  loading: 'eager' | 'lazy'
  variant: string
}

const CarouselPage: FC<Props> = ({ item, loading, variant }) => (
  <LocalizedLink key={item.href} to={item.href}>
    <ResponsivePicture {...item} variant={variant} loading={loading} />
  </LocalizedLink>
)

export default CarouselPage
