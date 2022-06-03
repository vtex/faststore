import { QuantitySelector as UIQuantitySelector } from '@faststore/ui'
import { memo, useEffect, useState } from 'react'

import Icon from 'src/components/ui/Icon'

import styles from './quantity-selector.module.scss'

interface QuantitySelectorProps {
  /**
   * The maximum value the quantity selector can receive
   */
  max?: number
  /**
   * The minimum value the quantity selector can receive
   */
  min?: number
  /**
   * The initial value for quantity selector
   */
  initial?: number
  /**
   * Specifies that the whole quantity selector component should be disabled.
   */
  disabled?: boolean
  /**
   * Event emitted when value is changed
   */
  onChange?: (value: number) => void
}

export function QuantitySelector({
  max,
  min = 1,
  initial,
  disabled = false,
  onChange,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState<number>(initial ?? min)
  const isLeftDisabled = quantity === min
  const isRightDisabled = quantity === max

  const changeQuantity = (increaseValue: number) => {
    const quantityValue = validateQuantityBounds(quantity + increaseValue)

    onChange?.(quantityValue)
    setQuantity(quantityValue)
  }

  const increase = () => changeQuantity(1)

  const decrease = () => changeQuantity(-1)

  function validateQuantityBounds(n: number): number {
    const maxValue = min ? Math.max(n, min) : n

    return max ? Math.min(maxValue, max) : maxValue
  }

  function validateInput(e: React.FormEvent<HTMLInputElement>) {
    const val = e.currentTarget.value

    if (!Number.isNaN(Number(val))) {
      setQuantity(() => {
        const quantityValue = validateQuantityBounds(Number(val))

        onChange?.(quantityValue)

        return quantityValue
      })
    }
  }

  useEffect(() => {
    initial && setQuantity(initial)
  }, [initial])

  return (
    <UIQuantitySelector
      data-fs-quantity-selector={disabled ? 'disabled' : 'true'}
      className={styles.fsQuantitySelector}
      quantity={quantity}
      leftButtonProps={{
        onClick: decrease,
        disabled: isLeftDisabled || disabled,
        icon: <Icon name="Minus" width={16} height={16} weight="bold" />,
        testId: 'store-quantity-selector-left',
      }}
      rightButtonProps={{
        onClick: increase,
        disabled: isRightDisabled || disabled,
        icon: <Icon name="Plus" width={16} height={16} weight="bold" />,
        testId: 'store-quantity-selector-right',
      }}
      inputProps={{
        onChange: validateInput,
        readOnly: false,
        disabled,
      }}
    />
  )
}

export default memo(QuantitySelector)
