import React, { FC } from 'react'
import { Box } from 'theme-ui'

export interface Value {
  to: string
  name: string
  quantity: number
  selected: boolean
}

type Props = {
  name: string
  values: Value[]
  variant: string
  renderItem: (facet: Value, variant: string) => JSX.Element
}

export const FilterSelector: FC<Props> = ({
  variant: v,
  values,
  name,
  renderItem,
}) => {
  const variant = `${v}.selector`

  return (
    <Box as="ul" variant={`${variant}.ul`}>
      {values.map((item, index) => (
        <li key={`${name}:${index}`}>{renderItem(item, variant)}</li>
      ))}
    </Box>
  )
}
