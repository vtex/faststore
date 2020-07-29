import React, { FC, Fragment } from 'react'
import { FilterOptions } from '@vtex/gatsby-source-vtex'
import { Box } from '@material-ui/core'

import Checkbox from '../../material-ui-components/Checkbox'
import Typography from '../../material-ui-components/Typography'
import { useSearchFilters } from '../../../providers/SearchFilter'

interface BrandFacet {
  id: number
  name: string
}

interface Props {
  brands: BrandFacet[]
}

const toggleFilter = (id: number, filters: FilterOptions) => {
  // First time adding a brand, just append it
  if (!filters.brandIds) {
    return {
      ...filters,
      brandIds: [id],
    }
  }

  const { brandIds } = filters

  const index = brandIds.findIndex((i) => i === id)

  // item already filtering result, let's remove it
  if (index > -1) {
    brandIds.splice(index, 1)

    return {
      ...filters,
      brandIds: brandIds.length === 0 ? undefined : brandIds,
    }
  }

  // filter not found on array, let's add it
  return {
    ...filters,
    brandIds: [...brandIds, id],
  }
}

const BrandSelector: FC<Props> = ({ brands }) => {
  const [, setFilters] = useSearchFilters()

  return (
    <Fragment>
      <Typography>Brands</Typography>

      <Box py={2}>
        <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
          {brands.map(({ name, id }, index) => (
            <li key={`brands-selector-${index}`}>
              <Checkbox
                onClick={() =>
                  setFilters((filters) => toggleFilter(id, filters))
                }
                label={name}
              />
            </li>
          ))}
        </ul>
      </Box>
    </Fragment>
  )
}

export default BrandSelector
