import React, { FC } from 'react'

import { Block as BlockType } from '../common'
import { components } from '../index'

interface Props {
  block: BlockType
}

const Block: FC<Props> = ({ block }) => {
  const { name, props } = block
  const Component = components[name]

  return <Component {...props} />
}

export default Block
