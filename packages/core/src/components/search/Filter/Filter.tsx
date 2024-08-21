import { useUI } from '@faststore/ui'
import type { Filter_FacetsFragment } from '@generated/graphql'

import { gql } from '@generated'
import { ProductGalleryProps } from 'src/components/ui/ProductGallery/ProductGallery'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import { useFilter } from 'src/sdk/search/useFilter'
import useDeviceDetect from 'src/sdk/ui/useDeviceDetect'

interface Props {
  /**
   * CMS defined data to be used in filter component.
   */
  filter: ProductGalleryProps['filter']
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

function Filter({
  facets: allFacets,
  testId = 'fs-filter',
  filter: filterCmsData,
}: Props) {
  const {
    __experimentalFilterDesktop: FilterDesktop,
    __experimentalFilterSlider: FilterSlider,
  } = useOverrideComponents<'ProductGallery'>()

  const isMobile = useDeviceDetect()

  const filter = useFilter(allFacets)
  const { filter: displayFilter } = useUI()

  return (
    <>
      <div className="hidden-mobile">
        {!isMobile && (
          <FilterDesktop.Component
            {...FilterDesktop.props}
            {...filter}
            testId={testId}
            title={filterCmsData?.title}
          />
        )}
      </div>

      {displayFilter && (
        <FilterSlider.Component
          {...FilterSlider.props}
          {...filter}
          testId={testId}
          title={filterCmsData?.title}
          clearButtonLabel={filterCmsData?.mobileOnly?.clearButtonLabel}
          applyButtonLabel={filterCmsData?.mobileOnly?.applyButtonLabel}
        />
      )}
    </>
  )
}

export const fragment = gql(`
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
`)

export default Filter
