import { gql } from '@faststore/graphql-utils'
import { useUI } from '@faststore/ui'
import type { Filter_FacetsFragment } from '@generated/graphql'
import { lazy, Suspense } from 'react'
import FilterDesktop from './FilterDesktop'
import { useFilter } from './useFilter'

const FilterSlider = lazy(() => import('./FilterSlider'))

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
        <FilterDesktop {...filter} testId={testId} title="Filters" />
      </div>

      {displayFilter && (
        <Suspense fallback={null}>
          <FilterSlider {...filter} testId={testId} title="Filters" />
        </Suspense>
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
