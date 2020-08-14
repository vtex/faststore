import React, { FC } from 'react'

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
    <ul>
      {values.map((item, index) => (
        <li key={`${name}:${index}`}>{renderItem(item, variant)}</li>
      ))}
    </ul>
  )
}
