import { Block as BlockType } from '@vtex/gatsby-transformer-vtex-cms'
import React, { FC } from 'react'

import { components } from './components'

interface Props {
  block: BlockType
}

const Block: FC<Props> = ({ block }) => {
  const { name, props } = block
  const Component = components[name]

  return <Component {...props} />
}

export default Block
