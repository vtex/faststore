import React from 'react'
import { Image } from 'theme-ui'
import type { FC, ComponentPropsWithoutRef } from 'react'

interface Props extends ComponentPropsWithoutRef<typeof Image> {
  width: string
  height: string
}

const MinicartDrawerImage: FC<Props> = ({ loading = 'lazy', ...props }) => (
  <Image {...props} loading={loading} />
)

export default MinicartDrawerImage
