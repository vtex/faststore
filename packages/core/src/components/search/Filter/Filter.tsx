import { gql } from '@faststore/graphql-utils'

import { useUI } from '@faststore/ui'
import type { Filter_FacetsFragment } from '@generated/graphql'
import FilterFixed from './FilterFixed'
import FilterSlider from './FilterSlider'
import { useFilter } from './useFilter'

interface Props {
  /**
   * The array that represents the details of every facet.
   */
  facets: Filter_FacetsFragment[]
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

function Filter({ facets: allFacets, testId = 'fs-filter' }: Props) {
  const filter = useFilter(allFacets)
  const { filter: displayFilter } = useUI()

  return (
    <>
      <div className="hidden-mobile">
        <FilterFixed {...filter} testId={testId} title="Filters" />
      </div>

      {displayFilter && (
        <FilterSlider {...filter} testId={testId} title="Filters" />
      )}
    </>
  )
}

export const fragment = gql`
  fragment Filter_facets on StoreFacet {
    ... on StoreFacetRange {
      key
      label

      min {
        selected
        absolute
      }

      max {
        selected
        absolute
      }

      __typename
    }
    ... on StoreFacetBoolean {
      key
      label
      values {
        label
        value
        selected
        quantity
      }

      __typename
    }
  }
`

export default Filter
