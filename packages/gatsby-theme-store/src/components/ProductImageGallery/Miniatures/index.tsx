import { Box } from '@vtex/store-ui'
import React from 'react'
import type { FC } from 'react'

import Page from './Page'
import type { Item } from '../Page'

interface Props {
  variant: string
  selectedPage: number
  allItems: Item[]
  onSelect: (index: number) => void
}

const Miniatures: FC<Props> = ({
  variant,
  onSelect,
  allItems,
  selectedPage,
}) => (
  <>
    {allItems.map((item, index) => (
      <Box
        key={`miniatures-${index}`}
        variant={`${variant}.miniature.${
          selectedPage === index ? 'active' : 'inactive'
        }`}
        onClick={() => onSelect(index)}
      >
        <Page variant={variant} item={item} />
      </Box>
    ))}
  </>
)

export default Miniatures
