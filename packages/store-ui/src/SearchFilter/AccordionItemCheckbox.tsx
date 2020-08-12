import React, { FC } from 'react'
import { Label, Checkbox, Box } from 'theme-ui'

export interface Props {
  name: string
  quantity: number
  selected: boolean
  variant: string
}

export const SearchFilterAccordionItemCheckbox: FC<Props> = ({
  variant,
  name,
  quantity,
  selected,
}) => (
  <Label>
    <Checkbox variant={`${variant}.checkbox`} checked={selected} readOnly />
    <Box variant={`${variant}.value`}>{name}</Box>
    <Box variant={`${variant}.quantity`}>{quantity}</Box>
  </Label>
)
