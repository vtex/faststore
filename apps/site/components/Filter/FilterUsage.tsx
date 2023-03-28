import { Button, useUI } from '@faststore/ui'
import { facetsMock } from '../../mocks/facets'
import FilterFixedUsage from './FilterFixedUsage'
import FilterSliderUsage from './FilterSliderUsage'
import { useFilter } from './useFilter'

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
        <FilterFixedUsage {...filter} testId="fs-filter" title="Filters" />
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
