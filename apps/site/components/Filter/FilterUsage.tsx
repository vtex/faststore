import { Button, useUI } from '@faststore/ui'
import { facetsMock } from '../../mocks/facets'
import FilterDesktopUsage from './FilterDesktopUsage'
import FilterSliderUsage from './FilterSliderUsage'
import { useFilter } from './useFilter'

export type FilterFacetBoolean = {
  __typename: 'StoreFacetBoolean'
  key: string
  label: string
  values: Array<{
    label: string
    value: string
    selected: boolean
    quantity: number
  }>
}

export type FilterFacetRange = {
  __typename: 'StoreFacetRange'
  key: string
  label: string
  min: { selected: number; absolute: number }
  max: { selected: number; absolute: number }
}

export type FilterFacet = FilterFacetBoolean | FilterFacetRange

const FilterUsage = ({ onlyMobile }: { onlyMobile?: boolean }) => {
  const filter = useFilter(facetsMock)
  const { filter: displayFilter, openFilter } = useUI()
  return onlyMobile ? (
    <>
      <Button
        variant="tertiary"
        iconPosition="left"
        aria-label="Open Filters"
        onClick={openFilter}
      >
        Open Filters
      </Button>
      {displayFilter && (
        <FilterSliderUsage {...filter} testId="fs-filter" title="Filters" />
      )}
    </>
  ) : (
    <>
      <div className="hidden-mobile" style={{ width: '100%' }}>
        <FilterDesktopUsage {...filter} testId="fs-filter" title="Filters" />
      </div>
      <div className="display-mobile">
        <Button
          variant="tertiary"
          iconPosition="left"
          aria-label="Open Filters"
          onClick={openFilter}
        >
          Open Filters
        </Button>
      </div>
      {displayFilter && (
        <FilterSliderUsage {...filter} testId="fs-filter" title="Filters" />
      )}
    </>
  )
}

export default FilterUsage
