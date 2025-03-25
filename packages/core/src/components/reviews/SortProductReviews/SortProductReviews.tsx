import {
  SelectField as UISelectField,
  type SelectFieldProps,
} from '@faststore/ui'
import type { StoreProductListReviewsSort } from '@generated/graphql'

const OptionsMap: Record<StoreProductListReviewsSort, string> = {
  reviewDateTime_desc: 'Most Recent',
  reviewDateTime_asc: 'Oldest',
  rating_desc: 'Highest Rated',
  rating_asc: 'Lowest Rated',
}

export interface SortProductReviewsProps
  extends Omit<SelectFieldProps, 'label' | 'options' | 'onChange'> {
  label?: string
  options?: Partial<typeof OptionsMap>
  value?: StoreProductListReviewsSort
  onChange?: (value: StoreProductListReviewsSort) => void
}

function SortProductReviews({
  testId = 'fs-sort-product-reviews-select',
  label = 'Sort by',
  options = OptionsMap,
  value,
  onChange,
  ...otherProps
}: SortProductReviewsProps) {
  const optionsMap = Object.keys(options).reduce(
    (acc, currentKey: StoreProductListReviewsSort) => {
      acc[currentKey] = options[currentKey] ?? OptionsMap[currentKey]
      return acc
    },
    {} as Record<StoreProductListReviewsSort, string>
  )

  return (
    <UISelectField
      className="sort / text__title-mini-alt"
      label={label}
      options={optionsMap}
      onChange={(e) => {
        onChange?.(e.target.value as string as StoreProductListReviewsSort)
      }}
      value={value}
      {...otherProps}
    />
  )
}

export default SortProductReviews
