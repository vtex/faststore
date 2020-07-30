/** @jsx jsx */
import { FC, Fragment } from 'react'
import { Checkbox, Label, jsx } from 'theme-ui'

import { useSearchFilters, SearchOptions } from '../../../providers/Search'

interface BrandFacet {
  name: string
  value: string
  quantity: number
}

interface Props {
  brands: BrandFacet[]
}

const toggleFilter = (value: string, filters: SearchOptions) => {
  const { query, map } = filters
  const lowered = value.toLowerCase()
  const withSlash = lowered

  if (query?.includes(withSlash) && map?.includes(',b')) {
    return {
      ...filters,
      query: query.replace(withSlash, ''),
      map: map.replace(',b', ''),
    }
  }

  return {
    ...filters,
    query: `${query}/${lowered}`,
    map: `${map},b`,
  }
}

const BrandSelector: FC<Props> = ({ brands }) => {
  const { setFilters } = useSearchFilters()

  return (
    <Fragment>
      <div>Brands</div>

      <ul sx={{ listStyleType: 'none', mx: 0, px: 0 }}>
        {brands.map(({ name, value }, index) => (
          <li key={`brands-selector-${index}`}>
            <Label>
              <Checkbox
                onClick={() =>
                  setFilters((filters) => toggleFilter(value, filters))
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
