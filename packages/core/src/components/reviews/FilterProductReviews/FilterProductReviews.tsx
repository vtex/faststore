import { SelectField } from '@faststore/ui'

export type FilterProductListReview = 'all' | '1' | '2' | '3' | '4' | '5'

const OptionsMap: Record<FilterProductListReview, string> = {
  all: 'All',
  '1': '1 Star',
  '2': '2 Stars',
  '3': '3 Stars',
  '4': '4 Stars',
  '5': '5 Stars',
}

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
        onChange?.(e.target.value as FilterProductListReview)
      }}
      value={value || 'all'}
      testId="filter-product-reviews-select"
    />
  )
}

export default FilterProductReviews
