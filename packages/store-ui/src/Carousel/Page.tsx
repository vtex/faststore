import React from 'react'
import type { Component, ComponentPropsWithoutRef, FC } from 'react'

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
  link?: typeof Component | FC
}

const CarouselPage: FC<Props> = ({
  item,
  loading,
  width,
  height,
  variant,
  link: Link = LocalizedLink,
}) => (
  <Link key={item.href} to={item.href}>
    <ResponsivePicture
      {...item}
      variant={variant}
      width={width}
      height={height}
      loading={loading}
    />
  </Link>
)

export default CarouselPage
