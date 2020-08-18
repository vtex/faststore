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

export const SearchControlsSelect: FC<Props> = ({
  onChange,
  'aria-label': ariaLabel = 'Refine Search',
  variant: v,
  ...props
}) => {
  const variant = `searchControls${v ? `.${v}` : ''}.select`

  return (
    <Select
      aria-label={ariaLabel}
      onChange={(event) => onChange(event.target.selectedOptions[0].value)}
      variant={variant}
      {...props}
    >
      {options.map(([value, label]) => (
        <option key={value} value={value} label={label} aria-label={label} />
      ))}
    </Select>
  )
}
