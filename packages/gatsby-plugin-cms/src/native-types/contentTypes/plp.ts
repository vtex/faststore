import { Collection } from '../blocks/collection'
import type { ContentType } from '../../index'

export function PLP({
  extraBlocks = {},
  beforeBlocks = {},
  afterBlocks = {},
}: Partial<Omit<ContentType, 'name'>>) {
  return {
    plp: {
      name: 'PLP',
      extraBlocks: {
        ...extraBlocks,
        Parameters: {
          ...extraBlocks.Parameters,
          Collection,
        },
      },
      beforeBlocks,
      afterBlocks,
    },
  }
}
