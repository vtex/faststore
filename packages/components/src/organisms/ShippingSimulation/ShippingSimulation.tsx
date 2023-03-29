import type { HTMLAttributes } from 'react'
import type { PriceFormatter } from '../../atoms/Price/Price'

import React from 'react'

import { ArrowSquareOut } from '../../assets'

import {
  Icon,
  Link,
  Table,
  TableBody,
  TableCell,
  TableRow,
  InputField,
  Price,
  LinkProps,
  LinkElementType,
} from '../..'

interface ShippingSla {
  carrier: string
  localizedEstimates: string
  price: number
}

export interface ShippingSimulationProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Formatter function that transforms the raw price value and render the result.
   */
  formatter: PriceFormatter
  /**
   * The Shipping Suggestions Section's title.
   */
  title?: string
  /**
   * The text displayed to Shipping Simulation input text.
   */
  inputLabel?: string
  /**
   * Props for the link for i don't know my postal code.
   */
  idkPostalCodeLinkProps?: Partial<LinkProps<LinkElementType>>
  /**
   * Callback function when input is typed.
   */
  onInput?: (event: React.FormEvent<HTMLInputElement>) => void
  /**
   * Callback function when form is submitted.
   */
  onSubmit?: () => void
  /**
   * Callback function when the clear button is clicked.
   */
  onClear?:  () => void
  /**
   * Location for shipping.
   */
  location?: string
  /**
   * Options for shipping simulation.
   */
  options?: ShippingSla[]
  /**
   * Show clear button.
   */
  displayClearButton?: boolean
  /**
   * Message of error.
   */
  errorMessage?: string
  /**
   * Postal code.
   */
  postalCode?: string
}

function ShippingSimulation({
  testId = 'fs-shipping-simulation',
  formatter,
  title = "Shipping",
  inputLabel =  "Postal Code",
  idkPostalCodeLinkProps,
  onInput,
  onSubmit,
  onClear,
  location,
  options = [],
  displayClearButton = false,
  errorMessage,
  postalCode,
  ...otherProps
}: ShippingSimulationProps) {

  const hasShippingOptions = !!options && options.length > 0

  return (
    <section
      data-fs-shipping-simulation
      data-fs-shipping-simulation-empty={!hasShippingOptions ? "true" : "false"}
      data-testid={testId}
      {...otherProps}
    >
      <h2 data-fs-shipping-simulation-title>
        {title}
      </h2>

      <InputField
        actionable
        error={errorMessage}
        id={`${testId}-input-field`}
        label={inputLabel}
        value={postalCode}
        onInput={(event) => onInput?.(event)}
        onSubmit={() => onSubmit?.()}
        onClear={() => onClear?.()}
        displayClearButton={displayClearButton}
      />

      <Link href="/" data-fs-shipping-simulation-link size="small" {...idkPostalCodeLinkProps}>
        {
          idkPostalCodeLinkProps?.children ??
          <>
            {"I don't know my Postal Code"}
            <Icon component={<ArrowSquareOut />} />
          </>
        }
      </Link>

      {hasShippingOptions && (
        <>
          <header data-fs-shipping-simulation-header>
            <h3 data-fs-shipping-simulation-subtitle>Shipping options</h3>
            <p data-fs-shipping-simulation-location>
              {location}
            </p>
          </header>

          <Table>
            <TableBody>
              {options.map((option) => (
                <TableRow key={option.carrier}>
                  <TableCell align="left">{option.carrier}</TableCell>
                  <TableCell>{option.localizedEstimates}</TableCell>
                  <TableCell align="right">
                    {option.price && (
                      <Price
                        formatter={formatter}
                        value={option.price}
                        SRText="price"
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </section>
  )
}

export default ShippingSimulation
