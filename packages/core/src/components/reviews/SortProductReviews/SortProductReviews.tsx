import { SelectField } from '@faststore/ui'
import type { StoreProductListReviewsSort } from '@generated/graphql'

const OptionsMap: Record<StoreProductListReviewsSort, string> = {
  reviewDateTime_desc: 'Most Recent',
  reviewDateTime_asc: 'Oldest',
  rating_desc: 'Highest Rated',
  rating_asc: 'Lowest Rated',
}

export interface SortProductReviewsProps {
  label?: string
  options?: Partial<typeof OptionsMap>
  value?: StoreProductListReviewsSort
  onChange?: (value: StoreProductListReviewsSort) => void
}

function SortProductReviews({
  label = 'Sort by',
  options = OptionsMap,
  value,
  onChange,
}: SortProductReviewsProps) {
  const optionsMap = Object.keys(options).reduce(
    (acc, currentKey: StoreProductListReviewsSort) => {
      acc[currentKey] = options[currentKey] ?? OptionsMap[currentKey]
      return acc
    },
    {} as Record<StoreProductListReviewsSort, string>
  )

  return (
    <SelectField
      id="sort-product-reviews-select"
      className="sort / text__title-mini-alt"
      label={label}
      options={optionsMap}
      onChange={(e) => {
        onChange?.(e.target.value as string as StoreProductListReviewsSort)
      }}
      value={value}
      testId="sort-product-reviews-select"
    />
  )
}

export default SortProductReviews
