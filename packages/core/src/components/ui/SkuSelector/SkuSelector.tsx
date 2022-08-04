import { Label, RadioGroup, RadioOption } from '@faststore/ui'
import type { ChangeEventHandler } from 'react'

import { Image } from 'src/components/ui/Image'

interface SkuProps {
  /**
   * Alternative text description of the image.
   */
  alt: string
  /**
   * Image URL.
   */
  src: string
  /**
   * Label to describe the image when selected.
   */
  label: string
  /**
   * Current value for this SKU.
   */
  value: string
  /**
   * Specifies that this option should be disabled.
   */
  disabled?: boolean
}

type Variant = 'color' | 'label' | 'image'

export interface SkuSelectorProps {
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
   * Default SKU option.
   */
  defaultSku?: string
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

function SkuSelector({
  label,
  variant,
  options,
  onChange,
  testId = 'store-sku-selector',
  activeValue,
}: SkuSelectorProps) {
  return (
    <div data-store-sku-selector data-testid={testId} data-variant={variant}>
      {label && (
        <Label data-sku-selector-label>
          {label}: <strong>{activeValue}</strong>
        </Label>
      )}
      <RadioGroup
        selectedValue={activeValue}
        name={`sku-selector-${variant}`}
        onChange={(e) => {
          onChange?.(e)
        }}
      >
        {options.map((option, index) => {
          return (
            <RadioOption
              key={String(index)}
              label={option.label}
              value={option.value}
              disabled={option.disabled}
              checked={option.value === activeValue}
            >
              {variant === 'label' && <span>{option.value}</span>}
              {variant === 'image' && 'src' in option && (
                <span>
                  <Image
                    data-sku-selector-image
                    src={option.src}
                    alt={option.alt}
                    width={20}
                    height={20}
                    loading="lazy"
                  />
                </span>
              )}
            </RadioOption>
          )
        })}
      </RadioGroup>
    </div>
  )
}

export default SkuSelector
