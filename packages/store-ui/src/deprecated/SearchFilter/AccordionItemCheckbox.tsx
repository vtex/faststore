import React from 'react'
import { Box, Checkbox, Label } from 'theme-ui'
import type { FC } from 'react'

export interface Item {
  key: string
  name: string
  value: string
  range: {
    from: number
    to: number
  }
  quantity: number
  selected: boolean
}

interface Props {
  item: Item
  variant: string
  onClick: (item: Item) => void
}

const SearchFilterAccordionItemCheckbox: FC<Props> = ({
  item: { name, quantity, selected },
  variant,
  onClick,
  item,
}) => (
  <Label
    onClick={(e) => {
      e.preventDefault()
      onClick(item)
    }}
  >
    <Checkbox
      data-testid="filterItemCheckbox"
      variant={`${variant}.checkbox`}
      checked={selected}
      readOnly
    />
    <Box data-testid="filterItemValue" variant={`${variant}.value`}>
      {name}
    </Box>
    <Box variant={`${variant}.quantity`}>{quantity}</Box>
  </Label>
)

export default SearchFilterAccordionItemCheckbox
