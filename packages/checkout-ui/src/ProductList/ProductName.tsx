import React, { FC } from 'react'
import { Link } from '@vtex/store-ui'

import { useItemContext } from './ItemContext'
import { opaque } from './utils/opaque'

export const ProductName: FC = () => {
  const { item, loading } = useItemContext()

  if (loading) {
    return <>loading...</>
  }

  return (
    <Link
      as="a"
      id={`name-${item.id}`}
      sx={{
        ...opaque(item.availability),
        color: 'text',
        fontWeight: 600,
        textDecoration: 'none',
        lineHeight: 'copy',
        '@media screen and (min-width: 40em)': {
          fontWeight: 500,
        },
      }}
      href={item.detailUrl || undefined}
    >
      {item.name}
    </Link>
  )
}
