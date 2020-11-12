/** @jsx jsx */
import { FC } from 'react'
import { jsx, Box } from '@vtex/store-ui'

import ProductImageGalleryPage, { Item } from '../Page'
import Container from './Container'

interface Props {
  variant: string
  selectedPage: number
  allItems: Item[]
  onSelect: (index: number) => void
}

const PaginationMiniatures: FC<Props> = ({
  variant,
  onSelect,
  allItems,
  selectedPage,
}) => (
  <Container variant={variant}>
    {allItems.map((item, index) => (
      <Box
        key={`paginationMiniatures-${index}`}
        variant={`${variant}.paginationMiniatures.${
          selectedPage === index ? 'active' : 'inactive'
        }`}
        onClick={() => onSelect(index)}
      >
        <ProductImageGalleryPage variant={variant} item={item} />
      </Box>
    ))}
  </Container>
)

export default PaginationMiniatures
