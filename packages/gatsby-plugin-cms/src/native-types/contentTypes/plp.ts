import { Collection } from '../blocks/collection'
import type { ContentType } from '../../index'

export const PLP = ({
  extraBlocks = {},
}: Partial<Omit<ContentType, 'name'>>) => ({
  plp: {
    name: 'PLP',
    extraBlocks: {
      ...extraBlocks,
      Parameters: {
        ...extraBlocks.Parameters,
        Collection,
      },
    },
  },
})
