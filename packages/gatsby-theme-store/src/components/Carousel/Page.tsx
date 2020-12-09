import { LocalizedLink, ResponsivePicture } from '@vtex/store-ui'
import React from 'react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type IResponsivePicture = ComponentPropsWithoutRef<typeof ResponsivePicture>

export interface Item extends Omit<IResponsivePicture, 'variant' | 'loading'> {
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
