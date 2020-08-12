import { FilterGroup, FilterSelectorItem } from '@vtex/store-ui'
import { Link } from 'gatsby'
import React, { FC } from 'react'
import { Box } from 'theme-ui'

import CollapsibleHeaderIcon from './CollapsibleHeaderIcon'

interface Props {
  variant: string
  allFacets: Array<{
    name: string
    values: any
  }>
}

const Facets: FC<Props> = ({ variant, allFacets }) => (
  <Box variant={variant}>
    <aside>
      <Box variant={`${variant}.title`}>Filters</Box>
      <hr />
      <FilterGroup
        filters={allFacets}
        variant={variant}
        renderIcon={(isActive) => <CollapsibleHeaderIcon isActive={isActive} />}
        renderItem={(item, v) => (
          <Link to={item.to}>
            <FilterSelectorItem {...item} variant={v} />
          </Link>
        )}
      />
    </aside>
  </Box>
)

export default Facets
