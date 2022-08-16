import { Label, RadioGroup, RadioOption } from '@faststore/ui'
import type { ChangeEventHandler } from 'react'

import { Image } from 'src/components/ui/Image'

import styles from './sku-selector.module.scss'

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

// TODO: Add the 'color' variant back once the store supports naturally handling color SKUs.
type Variant = 'label' | 'image'

export interface SkuSelectorProps {
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

function SkuSelector({
  id,
  label,
  variant,
  options,
  onChange,
  testId = 'store-sku-selector',
  activeValue,
}: SkuSelectorProps) {
  const radioGroupId = id ? `-${id}` : ''

  return (
    <div
      data-fs-sku-selector
      data-testid={testId}
      className={styles.fsSkuSelector}
      data-fs-sku-selector-variant={variant}
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
                <span>
                  <Image
                    src={option.src}
                    alt={option.alt}
                    width={20}
                    height={20}
                    loading="lazy"
                    data-fs-sku-selector-option-image
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
