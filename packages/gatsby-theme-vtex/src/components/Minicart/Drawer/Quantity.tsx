import { Select, Input } from '@vtex/store-ui'
import React, { useState } from 'react'

import { useOrderForm } from '../../../sdk/orderForm/useOrderForm'

type Props = {
  index: number
}

const MinicartQuantity = (props: Props) => {
  const { value, updateItems } = useOrderForm()
  const data = value?.items[props.index]
  const [quantityLocally, setValue] = useState<number>(data?.quantity ?? 1)
  const useQuantity = {
    value: quantityLocally,
    onChange: async (e: any) => {
      const quantity = Number(e.target.value)

      setValue(quantity)

      const item = {
        id: Number(data?.id),
        quantity,
        seller: data?.seller ?? '1',
        index: props.index,
      }

      await updateItems([item])
    },
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
