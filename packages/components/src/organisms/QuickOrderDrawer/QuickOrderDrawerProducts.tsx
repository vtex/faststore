import React, { useState } from 'react'
import Icon from '../../atoms/Icon'
import IconButton from '../../molecules/IconButton'
import QuantitySelector from '../../molecules/QuantitySelector'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '../../molecules/Table'

import Badge from '../../atoms/Badge'
import type { PriceFormatter } from '../../atoms/Price'
import Price from '../../atoms/Price'
import { useUI } from '../../hooks'
import Alert from '../../molecules/Alert'
import Tooltip from '../../molecules/Tooltip'
import {
  useQuickOrderDrawer,
  type VariationProductColumn,
} from './provider/QuickOrderDrawerProvider'

export type QuickOrderDrawerProductsProps = {
  columns: VariationProductColumn
  formatter?: PriceFormatter
}

const QuickOrderDrawerProducts = ({
  columns,
  formatter,
}: QuickOrderDrawerProductsProps) => {
  const { pushToast } = useUI()
  const { products, onChangeQuantityItem, onDelete } = useQuickOrderDrawer()

  const [alertMessage, setAlertMessage] = useState(
    'Some of the SKUs are not available. Please adjust the amount before proceeding to the cart.'
  )

  return (
    <div data-fs-qod-content>
      <>
        {alertMessage && (
          <Alert
            icon={<Icon name="AlertFilled" weight="bold" />}
            dismissible
            onClick={() => setAlertMessage('')}
            aria-label="Product availability warning"
          >
            {alertMessage}
          </Alert>
        )}
        <Table
          data-fs-qod-table
          variant="bordered"
          aria-label="Quick order products list"
        >
          <TableHead>
            <TableRow>
              <TableCell
                data-fs-qod-product-header
                align="left"
                variant="header"
                scope="col"
              >
                {columns.name}
              </TableCell>

              <TableCell align="left" variant="header" scope="col">
                {columns.availability.label}
              </TableCell>

              <TableCell align="center" variant="header" scope="col">
                {columns.price}
              </TableCell>

              <TableCell align="left" variant="header" scope="col">
                {columns.quantity}
              </TableCell>
              <TableCell align="right" variant="header" scope="col"></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((variantProduct) => (
              <TableRow
                key={`${variantProduct.name}-${variantProduct.id}`}
                data-fs-qod-table-row={variantProduct.availability}
              >
                <TableCell data-fs-qod-cell="product" align="left">
                  <div data-fs-qod-table-cell-img-container>
                    <img
                      height={48}
                      src={variantProduct.image.url}
                      alt={
                        variantProduct.image.alternateName ||
                        variantProduct.name
                      }
                    />
                  </div>

                  <div data-fs-qod-table-cell-name-container>
                    <div data-fs-qod-text={'primary'}>
                      {variantProduct.name}
                    </div>
                    <span data-fs-qod-text={'secondary'}>
                      {variantProduct.id}
                    </span>
                  </div>
                  {variantProduct.availability === 'available' &&
                    variantProduct.quantityUpdated && (
                      <Tooltip
                        content={'Quantity updated to match our inventory'}
                        placement="left-center"
                      >
                        <IconButton
                          aria-label="Quantity adjusted to match available inventory"
                          icon={<Icon name="CircleWarning" weight="bold" />}
                        />
                      </Tooltip>
                    )}
                </TableCell>

                <TableCell align="left">
                  {columns.availability.stockDisplaySettings ===
                    'showAvailability' && (
                    <Badge
                      variant={
                        variantProduct.availability === 'outOfStock'
                          ? 'warning'
                          : 'success'
                      }
                    >
                      {variantProduct.availability === 'outOfStock'
                        ? 'Out of stock'
                        : 'Available'}
                    </Badge>
                  )}

                  {columns.availability.stockDisplaySettings ===
                    'showStockQuantity' && variantProduct.inventory}
                </TableCell>

                <TableCell data-fs-qod-cell="price" align="right">
                  <Price
                    value={variantProduct.price}
                    variant="spot"
                    formatter={formatter}
                    data-fs-qod-table-price={variantProduct.availability}
                  />
                </TableCell>

                <TableCell align="right" data-fs-qod-cell="quantity-selector">
                  <div data-fs-qod-table-action>
                    <QuantitySelector
                      min={0}
                      max={variantProduct.inventory}
                      disabled={
                        !variantProduct.inventory ||
                        variantProduct.availability === 'outOfStock'
                      }
                      initial={variantProduct.selectedCount}
                      onChange={(value) =>
                        onChangeQuantityItem(variantProduct.id, value)
                      }
                      aria-label={`Select quantity for ${variantProduct.name}`}
                      onValidateBlur={(
                        min: number,
                        maxValue: number,
                        quantity: number
                      ) => {
                        pushToast({
                          title: 'Invalid quantity!',
                          message: `The quantity you entered is outside the range of ${min} to ${maxValue}. The quantity was set to ${quantity}.`,
                          status: 'INFO',
                          icon: (
                            <Icon
                              name="CircleWavyWarning"
                              width={30}
                              height={30}
                            />
                          ),
                        })
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell align="right" data-fs-qod-delete-cell>
                  <IconButton
                    onClick={() => onDelete(variantProduct.id)}
                    icon={<Icon name="Thrash" color="#1F1F1F" />}
                    aria-label={`Remove ${variantProduct.name} from quick order list`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    </div>
  )
}

export default QuickOrderDrawerProducts
