import Image from 'next/image'
import React, { useMemo } from 'react'
import { Badge, Button, QuantitySelector, Skeleton } from '../..'
import Price, { PriceFormatter } from '../../atoms/Price'
import Icon from '../../atoms/Icon'
import { useFadeEffect, useSKUMatrix, useUI } from '../../hooks'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '../../molecules/Table'
import SlideOver, { SlideOverHeader, SlideOverProps } from '../SlideOver'

interface VariationProductColumn {
  name: string
  additionalColumns: Array<{ label: string; value: string }>
  availability: {
    label: string
    stockDisplaySettings: 'showStockQuantity' | 'showAvailability'
  }
  price: number
  quantitySelector: number
}

export interface SKUMatrixSidebarProps
  extends Omit<SlideOverProps, 'isOpen' | 'setIsOpen' | "fade"> {
  /**
   * Title for the SKUMatrixSidebar component.
   */
  title?: string
  /**
   * Represents the variations products to building the table.
   */
  columns: VariationProductColumn
  /**
   * Properties related to the 'add to cart' button
   */
  buyProps: {
    'data-testid': string
    'data-sku': string
    'data-seller': string
    onClick(e: React.MouseEvent<HTMLButtonElement>): void
  }
  /**
   * Formatter function that transforms the raw price value and render the result.
   */
  formatter?: PriceFormatter
  /**
   * Check if some result is still loading before render the result.
   */
  loading?: boolean
}

function SKUMatrixSidebar({
  direction = 'rightSide',
  title,
  overlayProps,
  size = 'partial',
  children,
  columns,
  buyProps: { onClick: buyButtonOnClick, ...buyProps },
  loading,
  formatter,
  ...otherProps
}: SKUMatrixSidebarProps) {
  const {
    isOpen,
    setIsOpen,
    setAllVariantProducts,
    allVariantProducts,
    onChangeQuantityItem,
  } = useSKUMatrix()
  const { pushToast } = useUI()
  const { fade } = useFadeEffect()

  const cartDetails = useMemo(() => {
    return allVariantProducts.reduce(
      (acc, product) => ({
        amount: acc.amount + product.selectedCount,
        subtotal: acc.subtotal + product.selectedCount * product.price,
      }),
      { amount: 0, subtotal: 0 }
    )
  }, [allVariantProducts])

  function resetQuantityItems() {
    setAllVariantProducts((prev) =>
      prev.map((item) => ({ ...item, quantity: 0 }))
    )
  }

  function onClose() {
    resetQuantityItems()
    setIsOpen(false)
  }

  function handleAddToCart(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    buyButtonOnClick(e)
    onClose()
  }

  const totalColumnsSkeletonLength =
    Object.keys(columns).filter((v) => v !== 'additionalColumns').length +
    (columns.additionalColumns?.length ?? 0)

  return (
    <SlideOver
      data-fs-sku-matrix-sidebar
      size={size}
      direction={direction}
      overlayProps={overlayProps}
      isOpen={isOpen}
      fade={fade}
      {...otherProps}
    >
      <SlideOverHeader onClose={onClose}>
        <h2 data-fs-sku-matrix-sidebar-title>{title}</h2>
      </SlideOverHeader>

      {children}

      <Table variant="bordered">
        <TableHead>
          <TableRow>
            <TableCell align="left" variant="header" scope="col">
              {columns.name}
            </TableCell>

            {columns.additionalColumns?.map(({ label, value }) => (
              <TableCell key={value} align="left" variant="header" scope="col">
                {label}
              </TableCell>
            ))}

            <TableCell align="left" variant="header" scope="col">
              {columns.availability.label}
            </TableCell>

            <TableCell align="right" variant="header" scope="col">
              {columns.price}
            </TableCell>

            <TableCell align="left" variant="header" scope="col">
              {columns.quantitySelector}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            <>
              {Array.from({ length: 5 }).map((_, index) => {
                return (
                  <TableRow key={`table-row-${index}`}>
                    {Array.from({
                      length: totalColumnsSkeletonLength,
                    }).map((_, index) => {
                      return (
                        <TableCell key={`table-cell-${index}`}>
                          <span>
                            <Skeleton
                              key={index}
                              size={{ width: '100%', height: '30px' }}
                            />
                          </span>
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </>
          ) : (
            <>
              {allVariantProducts.map((variantProduct) => (
                <TableRow key={`${variantProduct.name}-${variantProduct.id}`}>
                  <TableCell data-fs-sku-matrix-sidebar-cell-image align="left">
                    <Image
                      src={variantProduct.image.url}
                      alt={variantProduct.image.alternateName}
                      width={48}
                      height={48}
                    />
                    {variantProduct.name}
                  </TableCell>

                  {columns.additionalColumns?.map(({ value }) => (
                    <TableCell
                      key={`${variantProduct.name}-${variantProduct.id}-${value}`}
                      align="left"
                    >
                      {variantProduct.specifications[value.toLowerCase()]}
                    </TableCell>
                  ))}

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

                  <TableCell align="right">
                    <div data-fs-sku-matrix-sidebar-table-price>
                      <Price
                        value={variantProduct.price}
                        variant="spot"
                        formatter={formatter}
                      />
                    </div>
                  </TableCell>

                  <TableCell
                    align="right"
                    data-fs-sku-matrix-sidebar-table-cell-quantity-selector
                  >
                    <div data-fs-sku-matrix-sidebar-table-action>
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
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>

      <footer data-fs-sku-matrix-sidebar-footer>
        <div>
          <p>
            {cartDetails.amount} {cartDetails.amount !== 1 ? 'Items' : 'Item'}
          </p>
          <Price
            value={cartDetails.subtotal}
            variant="spot"
            formatter={formatter}
          />
        </div>

        <Button
          variant="primary"
          disabled={!cartDetails.amount}
          onClick={handleAddToCart}
          {...buyProps}
        >
          Add to Cart
        </Button>
      </footer>
    </SlideOver>
  )
}

export default SKUMatrixSidebar
