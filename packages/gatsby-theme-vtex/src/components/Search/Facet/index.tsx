import { Box, FilterGroup, FilterSelectorItem } from '@vtex/store-ui'
import { Link } from 'gatsby'
import React, { FC } from 'react'

interface Value {
  name: string
  selected: boolean
  quantity: number
  to: string
}

interface TreeValue extends Value {
  pathname: string
  values: TreeValue[]
}

interface Props {
  variant: string
  specificationFilters: Array<{
    name: string
    values: Value[]
  }>
  brands: Value[]
  categoriesTrees: TreeValue[]
}

const Facets: FC<Props> = ({
  variant,
  specificationFilters,
  brands,
  categoriesTrees,
}) => {
  return (
    <Box variant={variant}>
      <aside>
        <Box variant={`${variant}.title`}>Filters</Box>

        <FilterGroup
          filters={categoriesTrees}
          variant={variant}
          renderItem={(item, v) => (
            <Link to={item.to.toLowerCase()}>
              <FilterSelectorItem {...item} variant={v} />
            </Link>
          )}
        />

        <FilterGroup
          filters={[{ name: 'Brands', values: brands }]}
          variant={variant}
          renderItem={(item, v) => (
            <Link to={item.to.toLowerCase()}>
              <FilterSelectorItem {...item} variant={v} />
            </Link>
          )}
        />

        <FilterGroup
          filters={specificationFilters}
          variant={variant}
          renderItem={(item, v) => (
            <Link to={item.to.toLowerCase()}>
              <FilterSelectorItem {...item} variant={v} />
            </Link>
          )}
        />
      </aside>
    </Box>
  )
}

export default Facets
