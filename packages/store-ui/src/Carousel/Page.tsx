import React from 'react'
import type {
  ComponentType,
  ComponentPropsWithoutRef,
  FC,
  AnchorHTMLAttributes,
} from 'react'

import ResponsivePicture from '../ResponsivePicture'

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
  Link?: ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>>
}

const CarouselPage: FC<Props> = ({
  item,
  loading,
  width,
  height,
  variant,
  Link = 'a',
}) => (
  <Link key={item.href} href={item.href}>
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
