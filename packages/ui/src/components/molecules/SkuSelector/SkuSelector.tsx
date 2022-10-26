import React, { forwardRef } from 'react'
import type { HTMLAttributes, ChangeEventHandler } from 'react'
import { Label, RadioGroup } from '../../..'

interface SkuProps {
  /**
   * Alternative text description of the image.
   */
  alt?: string
  /**
   * Image URL.
   */
  src?: string
  /**
   * Label to describe the option when selected.
   */
  label: string
  /**
   * Current value for this option.
   */
  value: string
  /**
   * Specifies that this option should be disabled.
   */
  disabled?: boolean
}

// TODO: Add the 'color' variant back once the store supports naturally handling color SKUs.
type Variant = 'label' | 'image'

export interface SkuSelectorProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * ID of the current instance of the component.
   */
  id?: string
  /**
   * Specify which variant the component should handle.
   */
  variant: Variant
  /**
   * SKU options that should be rendered.
   */
  options: SkuProps[]
  /**
   * Section label for the SKU selector.
   */
  label?: string
  /**
   * Currently active variation's value.
   */
  activeValue: string
  /**
   * Function to be triggered when SKU option change.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>
}

const SkuSelector = forwardRef<HTMLDivElement, SkuSelectorProps>(
  function SkuSelector(
    {
      id,
      label,
      variant,
      onChange,
      testId = 'store-sku-selector',
      activeValue,
      children,
      ...otherProps
    },
    ref
  ) {
    const radioGroupId = id ? `-${id}` : ''

    return (
      <div
        ref={ref}
        data-fs-sku-selector
        data-testid={testId}
        data-fs-sku-selector-variant={variant}
        {...otherProps}
      >
        {label && (
          <Label data-fs-sku-selector-title>
            {label}: <strong>{activeValue}</strong>
          </Label>
        )}
        <RadioGroup
          selectedValue={activeValue}
          name={`sku-selector-${variant}${radioGroupId}`}
          onChange={(e) => {
            onChange?.(e)
          }}
        >
          {children}
        </RadioGroup>
      </div>
    )
  }
)

export default SkuSelector
