/** @jsx jsx */
import { FC, Fragment } from 'react'
import { Checkbox, Label, jsx } from 'theme-ui'
import { FilterOptions } from '@vtex/gatsby-source-vtex'

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
      <div>Brands</div>

      <ul sx={{ listStyleType: 'none', mx: 0, px: 0 }}>
        {brands.map(({ name, id }, index) => (
          <li key={`brands-selector-${index}`}>
            <Label>
              <Checkbox
                onClick={() =>
                  setFilters((filters) => toggleFilter(id, filters))
                }
              />
              {name}
            </Label>
          </li>
        ))}
      </ul>
    </Fragment>
  )
}

export default BrandSelector
