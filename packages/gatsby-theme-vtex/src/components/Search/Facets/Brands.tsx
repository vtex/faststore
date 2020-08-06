/** @jsx jsx */
import { FC, Fragment } from 'react'
import { Checkbox, Label, jsx } from 'theme-ui'
import { graphql } from 'gatsby'

import { useSearchFilters, SearchOptions } from '../../../providers/Search'
import { BrandSelector_BrandsFragment } from './__generated__/BrandSelector_brands.graphql'

type Props = {
  brands: Array<BrandSelector_BrandsFragment | undefined | null>
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
        {brands?.map((brand, index) => (
          <li key={`brands-selector-${index}`}>
            <Label>
              <Checkbox
                onClick={() =>
                  setFilters((filters) => toggleFilter(brand!.value, filters))
                }
              />
              {brand!.name}
            </Label>
          </li>
        ))}
      </ul>
    </Fragment>
  )
}

export const fragment = graphql`
  fragment BrandSelector_brands on VTEX_BrandFacet {
    name
    value
    quantity
  }
`

export default BrandSelector
