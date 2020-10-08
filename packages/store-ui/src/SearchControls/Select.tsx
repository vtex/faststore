import React, { FC } from 'react'
import { Select, SelectProps } from 'theme-ui'

const options = [
  ['OrderByScoreDESC', 'searchControls.select.scoreDesc'],
  ['OrderByPriceDESC', 'searchControls.select.priceDesc'],
  ['OrderByPriceASC', 'searchControls.select.priceAsc'],
  ['OrderByTopSaleDESC', 'searchControls.select.topSaleDesc'],
  ['OrderByReviewRateDESC', 'searchControls.select.reviewRateDesc'],
  ['OrderByNameDESC', 'searchControls.select.nameDesc'],
  ['OrderByNameASC', 'searchControls.select.nameAsc'],
  ['OrderByReleaseDateDESC', 'searchControls.select.releaseDateDesc'],
  ['OrderByBestDiscountDESC', 'searchControls.select.bestDiscountDesc'],
]

interface Props extends Omit<SelectProps, 'onChange' | 'ref'> {
  onChange: (value: string) => void
  formatLabel: (x: string) => string
}

export const SearchControlsSelect: FC<Props> = ({
  onChange,
  'aria-label': ariaLabel = 'Refine Search',
  formatLabel,
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
      {options.map(([value, label]) => {
        const l = formatLabel(label)

        return <option label={l} key={value} value={value} aria-label={l} />
      })}
    </Select>
  )
}
