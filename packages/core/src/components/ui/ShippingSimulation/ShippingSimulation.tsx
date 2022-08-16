import { Table, TableBody, TableCell, TableRow } from '@faststore/ui'
import type { HTMLAttributes } from 'react'

import Price from 'src/components/ui/Price'
import { usePriceFormatter } from 'src/sdk/product/useFormattedPrice'

import Icon from '../Icon'
import InputText from '../InputText'
import Link from '../Link'
import styles from './shipping-simulation.module.scss'
import { useShippingSimulation } from './useShippingSimulation'

interface ShippingSimulationProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

function ShippingSimulation({
  testId = 'store-shipping-simulation',
  ...otherProps
}: ShippingSimulationProps) {
  const { dispatch, input, shippingSimulation, handleSubmit, handleOnInput } =
    useShippingSimulation()

  const {
    postalCode: shippingPostalCode,
    displayClearButton,
    errorMessage,
  } = input

  const { location: shippingLocation, options: shippingOptions } =
    shippingSimulation

  const formatter = usePriceFormatter()

  const hasShippingOptions = !!shippingOptions && shippingOptions.length > 0

  return (
    <section
      className={styles.fsShippingSimulation}
      data-fs-shipping-simulation
      data-fs-shipping-simulation-empty={!hasShippingOptions ? 'true' : 'false'}
      data-testid={testId}
      {...otherProps}
    >
      <h2 className="text__title-subsection" data-fs-shipping-simulation-title>
        Shipping
      </h2>

      <InputText
        actionable
        error={errorMessage}
        id="shipping-postal-code"
        label="Postal Code"
        value={shippingPostalCode}
        onInput={handleOnInput}
        onSubmit={handleSubmit}
        onClear={() => dispatch({ type: 'clear' })}
        displayClearButton={displayClearButton}
      />

      <Link href="/" data-fs-shipping-simulation-link>
        {"I don't know my Postal Code"}
        <Icon name="ArrowSquareOut" width={18} height={18} />
      </Link>

      {hasShippingOptions && (
        <>
          <h3 data-fs-shipping-simulation-subtitle>Shipping options</h3>
          <p className="text__body" data-fs-shipping-simulation-location>
            {shippingLocation}
          </p>

          <Table data-fs-shipping-simulation-table>
            <TableBody>
              {shippingOptions.map((option) => (
                <TableRow
                  key={option.carrier}
                  data-fs-shipping-simulation-table-row
                >
                  <TableCell data-fs-shipping-simulation-table-cell>
                    {option.carrier}
                  </TableCell>
                  <TableCell data-fs-shipping-simulation-table-cell>
                    {option.estimate}
                  </TableCell>
                  <TableCell data-fs-shipping-simulation-table-cell>
                    <Price
                      formatter={formatter}
                      value={option.price}
                      SRText="price"
                    />
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
