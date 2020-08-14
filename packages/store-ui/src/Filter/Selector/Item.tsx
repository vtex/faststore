import React, { FC } from 'react'
import { Label, Checkbox, Box } from 'theme-ui'

interface Props {
  name: string
  quantity: number
  selected: boolean
  variant: string
}

export const FilterSelectorItem: FC<Props> = ({
  variant: v,
  name,
  quantity,
  selected,
}) => {
  const variant = `${v}.item`

  return (
    <Label variant={variant}>
      <Checkbox variant={`${variant}.checkbox`} checked={selected} readOnly />
      <Box variant={`${variant}.value`}>{name}</Box>
      <Box variant={`${variant}.quantity`}>{quantity}</Box>
    </Label>
  )
}
