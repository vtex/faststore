import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Input, Select, Spinner, Flex, useNumericStepper } from '@vtex/store-ui'
import React, { useState, FC, ChangeEvent } from 'react'

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

const InputStepper: FC<{
  variant: string
  value: number
  onChange: (q: number) => void
}> = ({ variant, value, onChange }) => {
  const stepper = useNumericStepper({ value, min: 0, onChange })

  return <Input variant={variant} {...stepper} />
}

const MinicartQuantity = (props: Props) => {
  const updateItems = useUpdateItems(props.index)
  const { formatMessage } = useIntl()
  const item = useItem(props.index)
  const [quantityLocally, setQuantityLocally] = useState<number>(item.quantity)
  const [isLoading, setIsLoading] = useState(false)

  const onChange = (quantity: number) => {
    setIsLoading(true)
    setQuantityLocally(quantity)
    updateItems(quantity, () => setIsLoading(false))
  }

  const variant = `${props.variant}.quantity`

  const useQuantity = {
    value: quantityLocally,
    variant,
    onChange: (e: ChangeEvent<HTMLSelectElement>) =>
      onChange(Number(e.target.value)),
  }

  return quantityLocally >= 10 ? (
    <InputStepper {...useQuantity} onChange={onChange} />
  ) : (
    <QuantityWrapper isLoading={isLoading} variant={`${variant}.wrapper`}>
      <Select {...useQuantity}>
        <option value={0}>
          {formatMessage({ id: 'minicart.drawer.quantity.remove' })}
        </option>
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
    </QuantityWrapper>
  )
}

export default MinicartQuantity
