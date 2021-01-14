import React from 'react'
import type { ComponentPropsWithoutRef, FC } from 'react'

import { LocalizedLink, ResponsivePicture } from '../index'

type IResponsivePicture = ComponentPropsWithoutRef<typeof ResponsivePicture>

export interface Item extends Omit<IResponsivePicture, 'variant' | 'loading'> {
  href: string
}

interface Props {
  item: Item
  width: string
  height: string
  loading: 'eager' | 'lazy'
  variant: string
}

const CarouselPage: FC<Props> = ({ item, loading, width, height, variant }) => (
  <LocalizedLink key={item.href} to={item.href}>
    <ResponsivePicture
      {...item}
      variant={variant}
      width={width}
      height={height}
      loading={loading}
    />
  </LocalizedLink>
)

export default CarouselPage
