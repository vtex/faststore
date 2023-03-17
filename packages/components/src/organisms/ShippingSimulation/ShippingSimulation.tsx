import type { HTMLAttributes } from 'react'
import type { PriceFormatter } from '../../atoms/Price/Price'

import React from 'react'

import { XCircle as ArrowSquareOut } from '../../assets'

import {
  Icon,
  Link,
  Table,
  TableBody,
  TableCell,
  TableRow,
  InputField,
  Price,
} from '../..'
// import styles from './shipping-simulation.module.scss'
// import { useShippingSimulation } from './useShippingSimulation'

interface ProductShippingInfo {
  id: string
  seller: string
  quantity: number
}

interface ProductShippingOption {
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
   * Object used for simulating shippings
   */
  productShippingInfo: ProductShippingInfo

  formatter: PriceFormatter

  shippingLocation: string

  shippingOptions: ProductShippingOption[]
}

function ShippingSimulation({
  testId = 'store-shipping-simulation',
  productShippingInfo,
  formatter,
  shippingLocation,
  shippingOptions,
  ...otherProps
}: ShippingSimulationProps) {
  // const { dispatch, input, shippingSimulation, handleSubmit, handleOnInput } =
  //   useShippingSimulation(productShippingInfo)

  // const {
  //   postalCode: shippingPostalCode,
  //   displayClearButton,
  //   errorMessage,
  // } = input

  // const { location: shippingLocation, options: shippingOptions } =
  //   shippingSimulation

  const hasShippingOptions = !!shippingOptions && shippingOptions.length > 0

  return (
    <section
      data-fs-shipping-simulation
      data-fs-shipping-simulation-empty={!hasShippingOptions ? 'true' : 'false'}
      data-testid={testId}
      {...otherProps}
    >
      <h2 className="text__title-subsection" data-fs-shipping-simulation-title>
        Shipping
      </h2>

      <InputField
        actionable
        error={''}
        id="shipping-postal-code"
        label="Postal Code"
        value={''}
        onInput={() => {}}
        onSubmit={() => {}}
        onClear={() => {}}
        displayClearButton={false}
      />

      <Link href="/" data-fs-shipping-simulation-link size="small">
        {"I don't know my Postal Code"}
        <Icon component={<ArrowSquareOut />} />
      </Link>

      {hasShippingOptions && (
        <>
          <header data-fs-shipping-simulation-header>
            <h3 data-fs-shipping-simulation-subtitle>Shipping options</h3>
            <p className="text__body" data-fs-shipping-simulation-location>
              {shippingLocation}
            </p>
          </header>

          <Table>
            <TableBody>
              {shippingOptions.map((option) => (
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
