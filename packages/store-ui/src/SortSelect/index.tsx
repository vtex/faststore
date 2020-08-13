import React, { FC } from 'react'
import { Select } from '@vtex/store-ui'

const options = [
  ['Relevance', 'OrderByScoreDESC'],
  ['Price: High to Low', 'OrderByPriceDESC'],
  ['Price: Low to High', 'OrderByPriceASC'],
  ['Sales', 'OrderByTopSaleDESC'],
  ['Reviews', 'OrderByReviewRateDESC'],
  ['Name, ascending', 'OrderByNameDESC'],
  ['Name, descending', 'OrderByNameASC'],
  ['Release date', 'OrderByReleaseDateDESC'],
  ['Discount', 'OrderByBestDiscountDESC'],
]

interface Props {
  onChange: (value: string) => void
  variant?: string
}

export const SortSelect: FC<Props> = ({ onChange, variant }) => (
  <Select
    variant={variant}
    defaultValue="Relevance"
    onChange={(event) => onChange(event.target.selectedOptions[0].value)}
  >
    {options.map(([label, value]) => (
      <option key={label} value={value}>
        {label}
      </option>
    ))}
  </Select>
)
