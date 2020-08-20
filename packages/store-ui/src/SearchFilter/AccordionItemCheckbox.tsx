import React, { FC } from 'react'
import { Label, Checkbox, Box } from 'theme-ui'

export interface Item {
  key: string
  name: string
  value: string
  quantity: number
  selected: boolean
}

interface Props {
  item: Item
  variant: string
  onClick: (item: Item) => void
}

export const SearchFilterAccordionItemCheckbox: FC<Props> = ({
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
    <Checkbox variant={`${variant}.checkbox`} checked={selected} readOnly />
    <Box variant={`${variant}.value`}>{name}</Box>
    <Box variant={`${variant}.quantity`}>{quantity}</Box>
  </Label>
)
