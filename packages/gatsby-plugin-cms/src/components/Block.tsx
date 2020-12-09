import React from 'react'
import type { FC } from 'react'

import { schemas } from '..'
import type { Block as BlockType } from '../common'

interface Props {
  block: BlockType
}

const Block: FC<Props> = ({ block }) => {
  const { name, props } = block
  const Component = schemas[name].component

  return <Component {...props} />
}

export default Block
