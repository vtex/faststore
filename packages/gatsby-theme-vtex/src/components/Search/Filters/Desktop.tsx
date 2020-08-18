/** @jsx jsx */
import {
  Box,
  SearchFilterAccordion,
  SearchFilterAccordionItemCheckbox,
  SearchFilterValue,
  jsx,
} from '@vtex/store-ui'
import { Link } from 'gatsby'
import { FC, Fragment } from 'react'

import { TreeValue } from './types'

export interface Props {
  variant?: string
  isActive?: boolean
  specificationFilters: Array<{
    name: string
    values: SearchFilterValue[]
  }>
  brands: SearchFilterValue[]
  categoriesTrees: TreeValue[]
}

const SearchFilters: FC<Props> = ({
  variant = 'desktop',
  specificationFilters,
  brands,
  categoriesTrees,
  isActive = true,
}) => {
  return (
    <Fragment>
      <Box variant={`filters.${variant}.title`}>Filters</Box>

      <SearchFilterAccordion
        filters={categoriesTrees}
        isActive={isActive}
        variant={variant}
        renderItem={(item, v) => (
          <Link to={item.to} sx={{ variant: `${v}.a` }}>
            <SearchFilterAccordionItemCheckbox {...item} variant={v} />
          </Link>
        )}
      />

      <SearchFilterAccordion
        filters={[{ name: 'Brands', values: brands }]}
        isActive={isActive}
        variant={variant}
        renderItem={(item, v) => (
          <Link to={item.to} sx={{ variant: `${v}.a` }}>
            <SearchFilterAccordionItemCheckbox {...item} variant={v} />
          </Link>
        )}
      />

      <SearchFilterAccordion
        filters={specificationFilters}
        isActive={isActive}
        variant={variant}
        renderItem={(item, v) => (
          <Link to={item.to} sx={{ variant: `${v}.a` }}>
            <SearchFilterAccordionItemCheckbox {...item} variant={v} />
          </Link>
        )}
      />
    </Fragment>
  )
}

export default SearchFilters
