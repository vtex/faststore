import React, { FC } from 'react'

import { Block as BlockType } from '../common'
import { schemas } from '../index'

interface Props {
  block: BlockType
}

const Block: FC<Props> = ({ block }) => {
  const { name, props } = block
  const Component = schemas[name].component

  return <Component {...props} />
}

export default Block
