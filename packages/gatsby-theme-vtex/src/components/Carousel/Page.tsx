import React, { ComponentProps, FC } from 'react'
import { LocalizedLink, ResponsiveImage } from '@vtex/store-ui'

export interface Item
  extends Omit<ComponentProps<typeof ResponsiveImage>, 'ref' | 'variant'> {
  href: string
}

interface Props {
  item: Item
  loading: 'eager' | 'lazy'
  variant: string
}

const CarouselPage: FC<Props> = ({ item, loading, variant }) => (
  <LocalizedLink key={item.href} to={item.href}>
    <ResponsiveImage {...item} variant={variant} loading={loading} />
  </LocalizedLink>
)

export default CarouselPage
