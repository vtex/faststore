import React, { useCallback, useState } from 'react'
import { Flex } from 'theme-ui'
import type { PropsWithChildren } from 'react'

import Spinner from '../../../Spinner'
import type { Item } from '../../types'
import { NumericStepper } from '../../../ProductQuantity/NumericStepper'

interface Props<T extends Item> {
  item: T
  variant: string
  disabled?: boolean
  updateItem: (item: T) => Promise<void> | void
}

const MinicartDrawerQuantity = <T extends Item>({
  updateItem,
  item,
  variant: v,
  disabled: isDisabled = false,
}: PropsWithChildren<Props<T>>) => {
  const [isLoading, setIsLoading] = useState(false)
  const variant = `${v}.quantity`

  const onChange = useCallback(
    async (quantity: number) => {
      if (quantity === item.quantity) {
        return
      }

      try {
        setIsLoading(true)
        await updateItem({ ...item, quantity })
      } finally {
        setIsLoading(false)
      }
    },
    [item, updateItem]
  )

  return (
    <Flex variant={variant}>
      <NumericStepper
        disabled={isDisabled || isLoading}
        value={item.quantity}
        onChange={onChange}
      />
      {isLoading && (
        <Spinner variant={`${variant}.spinner`} width={24} height={24} />
      )}
    </Flex>
  )
}

export default MinicartDrawerQuantity
