import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Spinner, Flex, NumericStepper } from '@vtex/store-ui'
import React, { useState, FC, ChangeEvent, useCallback } from 'react'

import { useItem } from './useItem'
import { useUpdateItems } from './useUpdateItems'

type Props = {
  index: number
  variant?: string
}

type WrapperProps = {
  isLoading: boolean
  variant: string
}

const QuantityWrapper: FC<WrapperProps> = ({
  children,
  isLoading,
  variant,
}) => (
  <Flex variant={variant}>
    {children}
    {isLoading && (
      <Spinner variant={`${variant}.spinner`} width={24} height={24} />
    )}
  </Flex>
)

const MinicartQuantity = ({ variant: v, index }: Props) => {
  const updateItems = useUpdateItems(index)
  const item = useItem(index)
  const [isLoading, setIsLoading] = useState(false)

  const onChange = (quantity: number) => {
    if (quantity === item.quantity) {
      return
    }

    setIsLoading(true)
    updateItems(quantity, () => setIsLoading(false))
  }

  const variant = `${v}.quantity`

  return (
    <QuantityWrapper isLoading={isLoading} variant={`${variant}.wrapper`}>
      <NumericStepper
        disabled={isLoading}
        value={item.quantity}
        onChange={onChange}
      />
    </QuantityWrapper>
  )
}

export default MinicartQuantity
