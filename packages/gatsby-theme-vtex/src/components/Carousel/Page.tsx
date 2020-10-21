import React, { ComponentPropsWithoutRef, FC } from 'react'
import { LocalizedLink, ResponsiveImage } from '@vtex/store-ui'

export interface Item extends ComponentPropsWithoutRef<typeof ResponsiveImage> {
  href: string
}

interface Props {
  item: Item
  loading: 'eager' | 'lazy'
}

const CarouselPage: FC<Props> = ({ item, loading }) => (
  <LocalizedLink key={item.href} to={item.href}>
    <ResponsiveImage {...item} loading={loading} />
  </LocalizedLink>
)

export default CarouselPage
