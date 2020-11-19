import { Box } from '@vtex/store-ui'
import React, { FC } from 'react'

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
  ...props
}) => {
  const imageProps = {
    loading,
    ...props,
  }

  return (
    <Box variant={props.variant}>
      <Box {...imageProps} />
    </Box>
  )
}
