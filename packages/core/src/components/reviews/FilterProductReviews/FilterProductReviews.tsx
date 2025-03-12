import { useSearch } from '@faststore/sdk'
import { SelectField } from '@faststore/ui'
import type { StoreProductListReviewsSort } from '@generated/graphql'

export type FilterProductListReview = 'all' | '1' | '2' | '3' | '4' | '5'

const OptionsMap: Record<FilterProductListReview, string> = {
  all: 'All',
  '1': '1 Star',
  '2': '2 Stars',
  '3': '3 Stars',
  '4': '4 Stars',
  '5': '5 Stars',
}

const keys = Object.keys(OptionsMap) as Array<keyof typeof OptionsMap>

export interface FilterProductReviewsProps {
  label?: string
  options?: Partial<typeof OptionsMap>
  value?: FilterProductListReview
  onChange?: (value: FilterProductListReview) => void
}

function FilterProductReviews({
  label = 'Filter by',
  options = OptionsMap,
  value,
  onChange,
}: FilterProductReviewsProps) {
  const optionsMap = Object.keys(options).reduce(
    (acc, currentKey: FilterProductListReview) => {
      acc[currentKey] = options[currentKey] ?? OptionsMap[currentKey]
      return acc
    },
    {} as Record<FilterProductListReview, string>
  )

  return (
    <SelectField
      id="filter-product-reviews-select"
      className="filter / text__title-mini-alt"
      label={label}
      options={optionsMap}
      onChange={(e) => {
        const filter = keys[e.target.selectedIndex]
        onChange?.(filter)
      }}
      value={value || 'all'}
      testId="filter-product-reviews-select"
    />
  )
}

export default FilterProductReviews
