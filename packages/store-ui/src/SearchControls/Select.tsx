import React from 'react'
import { Select } from 'theme-ui'
import type { FC } from 'react'
import type { SelectProps } from 'theme-ui'

const options = [
  ['price-desc', 'searchControls.select.priceDesc'],
  ['price-asc', 'searchControls.select.priceAsc'],
  ['name-desc', 'searchControls.select.nameDesc'],
  ['name-asc', 'searchControls.select.nameAsc'],
  ['orders-desc', 'searchControls.select.topSaleDesc'],
  ['release-desc', 'searchControls.select.releaseDateDesc'],
  ['discount-desc', 'searchControls.select.bestDiscountDesc'],
  ['score-desc', 'searchControls.select.scoreDesc'],
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

        return (
          <option key={value} value={value} aria-label={l}>
            {l}
          </option>
        )
      })}
    </Select>
  )
}
