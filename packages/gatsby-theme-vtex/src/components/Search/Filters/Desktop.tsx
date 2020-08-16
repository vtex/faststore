import { Box, FilterGroup, FilterSelectorItem, Value } from '@vtex/store-ui'
import { Link } from 'gatsby'
import React, { FC } from 'react'

import { TreeValue } from './types'

export interface Props {
  variant: string
  isActive?: boolean
  specificationFilters: Array<{
    name: string
    values: Value[]
  }>
  brands: Value[]
  categoriesTrees: TreeValue[]
}

const SearchFilters: FC<Props> = ({
  variant,
  specificationFilters,
  brands,
  categoriesTrees,
  isActive = true,
}) => {
  return (
    <>
      <Box variant={`${variant}.title`}>Filters</Box>

      <FilterGroup
        filters={categoriesTrees}
        isActive={isActive}
        variant={variant}
        renderItem={(item, v) => (
          <Link to={item.to}>
            <FilterSelectorItem {...item} variant={v} />
          </Link>
        )}
      />

      <FilterGroup
        filters={[{ name: 'Brands', values: brands }]}
        isActive={isActive}
        variant={variant}
        renderItem={(item, v) => (
          <Link to={item.to}>
            <FilterSelectorItem {...item} variant={v} />
          </Link>
        )}
      />

      <FilterGroup
        filters={specificationFilters}
        isActive={isActive}
        variant={variant}
        renderItem={(item, v) => (
          <Link to={item.to}>
            <FilterSelectorItem {...item} variant={v} />
          </Link>
        )}
      />
    </>
  )
}

export default SearchFilters
