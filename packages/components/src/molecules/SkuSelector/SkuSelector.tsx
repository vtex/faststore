import type { ChangeEventHandler, HTMLAttributes } from 'react'
import React, { forwardRef, ReactNode } from 'react'
import { Label } from '../..'

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
  /**
   * A React component that will be rendered as a link.
   */
  children?: ReactNode
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
      label,
      variant,
      options,
      onChange,
      testId = 'fs-sku-selector',
      activeValue,
      ...otherProps
    },
    ref
  ) {
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
        <ul data-fs-sku-selector-list>
          {options.map((option, index) => {
            return (
              <li
                key={String(index)}
                data-fs-sku-selector-option
                data-fs-sku-selector-disabled={option.disabled}
                data-fs-sku-selector-checked={option.value === activeValue}
              >
                {variant === 'label' && (
                  <span>
                    {option.children}
                    {option.value}
                  </span>
                )}
                {variant === 'image' && 'src' in option && (
                  <span>{option.children}</span>
                )}
              </li>
            )
          })}
        </ul>
        {/* <RadioGroup
          selectedValue={activeValue}
          name={`sku-selector-${variant}${radioGroupId}`}
          onChange={(e) => {
            onChange?.(e)
          }}
        >
          {options.map((option, index) => {
            return (
              <RadioOption
                data-fs-sku-selector-option
                key={String(index)}
                label={option.label}
                value={option.value}
                disabled={option.disabled}
                checked={option.value === activeValue}
              >
                {variant === 'label' && <span>{option.value}</span>}
                {variant === 'image' && 'src' in option && (
                  <span>{children}</span>
                )}
              </RadioOption>
            )
          })}
        </RadioGroup> */}
      </div>
    )
  }
)

export default SkuSelector
