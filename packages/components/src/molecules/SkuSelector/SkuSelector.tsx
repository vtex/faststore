import type { ChangeEventHandler, HTMLAttributes } from 'react'
import React, { forwardRef, ReactNode } from 'react'
import { Label } from '../..'

interface SkuProps {
  /**
   * Alternative text description of the image. This is used on `renderImage` prop and it's mandatory if you want to use the `Image` variant.
   */
  alt?: string
  /**
   * Image URL. This is used on `renderImage` prop and it's mandatory if you want to use the `Image` variant.
   */
  src?: string
  /**
   * Current value for this option.
   */
  value?: string
  /**
   * URL for option's page. This is used on `renderLink` prop.
   */
  href: string
  /**
   * Hex color code for this option. This is mandatory if you want to use the `Color` variant.
   */
  hexColor?: string
  /**
   * Specifies that this option should be disabled.
   */
  disabled?: boolean
  /**
   * Function that returns a React component that will be rendered as a link.
   */
  renderLink: (href: string) => ReactNode
  /**
   * Function that returns a React component that will be used to render images.
   */
  renderImage?: (src?: string, alt?: string) => ReactNode
}

// TODO: Add the 'color' variant back once the store supports naturally handling color SKUs.
type Variant = 'label' | 'image' | 'color'

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
                {option.renderLink(option.href)}

                {variant === 'color' && (
                  <span>
                    <div
                      data-fs-sku-selector-option-color
                      title={option.value}
                      style={
                        {
                          '--data-fs-sku-selector-option-color-bkg-color':
                            option.hexColor,
                        } as React.CSSProperties
                      }
                    ></div>
                  </span>
                )}
                {variant === 'label' && <span>{option.value}</span>}
                {variant === 'image' && 'src' in option && (
                  <span>{option.renderImage?.(option.src!, option.alt)}</span>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
)

export default SkuSelector
