import React, { FC } from 'react'
import { Select, SelectProps } from 'theme-ui'

const options = [
  ['OrderByScoreDESC', 'Relevance'],
  ['OrderByPriceDESC', 'Price: High to Low'],
  ['OrderByPriceASC', 'Price: Low to High'],
  ['OrderByTopSaleDESC', 'Sales'],
  ['OrderByReviewRateDESC', 'Reviews'],
  ['OrderByNameDESC', 'Name, ascending'],
  ['OrderByNameASC', 'Name, descending'],
  ['OrderByReleaseDateDESC', 'Release date'],
  ['OrderByBestDiscountDESC', 'Discount'],
]

interface Props extends Omit<SelectProps, 'onChange' | 'ref'> {
  onChange: (value: string) => void
}

export const SortSelect: FC<Props> = ({
  onChange,
  variant,
  defaultValue,
  'aria-label': ariaLabel = 'Refine Search',
  ...props
}) => (
  <Select
    variant={variant}
    defaultValue={defaultValue}
    aria-label={ariaLabel}
    onChange={(event) => onChange(event.target.selectedOptions[0].value)}
    {...props}
  >
    {options.map(([value, label]) => (
      <option key={value} value={value} label={label} aria-label={label} />
    ))}
  </Select>
)
