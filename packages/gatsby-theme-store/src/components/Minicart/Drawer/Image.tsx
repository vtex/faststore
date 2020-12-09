import { Box } from '@vtex/store-ui'
import React from 'react'
import type { FC } from 'react'

type Props = {
  variant?: string
  as: React.ElementType
  width?: number
  height?: number
  src: string
  alt: string
  loading?: string
}

export const HeaderMinicartDrawerContentImage: FC<Props> = ({
  loading = 'lazy',
  variant,
  ...props
}) => {
  const imageProps = {
    loading,
    ...props,
  }

  return (
    <Box variant={variant}>
      <Box {...imageProps} />
    </Box>
  )
}
