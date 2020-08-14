import React, { FC } from 'react'
import { Select } from 'theme-ui'

const options = {
  OrderByScoreDESC: 'Relevance',
  OrderByPriceDESC: 'Price: High to Low',
  OrderByPriceASC: 'Price: Low to High',
  OrderByTopSaleDESC: 'Sales',
  OrderByReviewRateDESC: 'Reviews',
  OrderByNameDESC: 'Name, ascending',
  OrderByNameASC: 'Name, descending',
  OrderByReleaseDateDESC: 'Release date',
  OrderByBestDiscountDESC: 'Discount',
}

const entries = Object.entries(options)

interface Props {
  onChange: (value: string) => void
  variant?: string
  defaultValue: keyof typeof options
}

export const SortSelect: FC<Props> = ({ onChange, variant, defaultValue }) => (
  <Select
    variant={variant}
    defaultValue={options[defaultValue]}
    onChange={(event) => onChange(event.target.selectedOptions[0].value)}
  >
    {entries.map(([value, label]) => (
      <option key={value} value={value}>
        {label}
      </option>
    ))}
  </Select>
)
