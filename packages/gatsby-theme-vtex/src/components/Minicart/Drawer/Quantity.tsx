import { Input, Select } from '@vtex/store-ui'
import React, { useState } from 'react'

import { useItem } from './useItem'
import { useUpdateItems } from './useUpdateItems'

type Props = {
  index: number
  variant?: string
}

const MinicartQuantity = (props: Props) => {
  const updateItems = useUpdateItems(props.index)
  const item = useItem(props.index)
  const [quantityLocally, setQuantityLocally] = useState<number>(item.quantity)

  const onChange = (e: any) => {
    const quantity = Number(e.target.value)

    setQuantityLocally(quantity)

    updateItems(quantity)
  }

  const useQuantity = {
    value: quantityLocally,
    variant: `${props.variant}.quantity`,
    onChange,
  }

  return quantityLocally >= 10 ? (
    <Input {...useQuantity} />
  ) : (
    <Select {...useQuantity}>
      <option value={0}>0 - remover</option>
      <option value={1}>1</option>
      <option value={2}>2</option>
      <option value={3}>3</option>
      <option value={4}>4</option>
      <option value={5}>5</option>
      <option value={6}>6</option>
      <option value={7}>7</option>
      <option value={8}>8</option>
      <option value={9}>9</option>
      <option value={10}>10 +</option>
    </Select>
  )
}

export default MinicartQuantity
