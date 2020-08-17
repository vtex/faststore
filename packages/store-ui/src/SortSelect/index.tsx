import React, { FC } from 'react'
import { Select } from 'theme-ui'

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

interface Props {
  onChange: (value: string) => void
  variant?: string
  defaultValue: string // OrderByScoreDESC for example
}

export const SortSelect: FC<Props> = ({ onChange, variant, defaultValue }) => (
  <Select
    id="sortSelect"
    variant={variant}
    defaultValue={defaultValue}
    onChange={(event) => onChange(event.target.selectedOptions[0].value)}
  >
    {options.map(([value, label]) => (
      <option key={value} value={value} label={label} />
    ))}
  </Select>
)
