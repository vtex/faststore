import React, {  useMemo } from 'react'
import Image from 'next/image'
import SlideOver, { SlideOverHeader, SlideOverProps } from '../SlideOver'
import { useFadeEffect, useProductComparison } from '../../hooks'
import Select from '../../atoms/Select'
import ToggleField from '../../molecules/ToggleField'
import Badge from '../../atoms/Badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '../../molecules/Table'
import Price, { PriceFormatter } from '../../atoms/Price'
import Button from '../../atoms/Button'
import Dropdown, {
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from '../../molecules/Dropdown'
import Icon from '../../atoms/Icon'

export interface ProductComparisonSidebarProps
  extends Omit<SlideOverProps, 'children' | 'isOpen' | 'setIsOpen' | 'fade'> {
  /**
   * Formatter function that transforms the raw price value and render the result.
   */
  formatter?: PriceFormatter
  /**
   * Custom labels to introducing about products.
   */
  technicalInformation?: {
    title: string
    description: string
  }
}

function ProductComparisonSidebar({
  technicalInformation,
  size = 'partial',
  direction = 'rightSide',
  formatter,
  overlayProps,
  ...otherProps
}: ProductComparisonSidebarProps) {
  const { fade } = useFadeEffect()

  const { isOpen, setIsOpen, products } = useProductComparison()

  const productsSpecifications = useMemo(() => Array.from(
    new Set(
      products.reduce<string[]>((acc, product) => {
        const productSpecificationsFields = product.skuSpecifications?.map(
          (spec) => spec?.field
        ) || []

        return [...acc, ...(productSpecificationsFields as string[])]
      }, [])
    )
  ), products)

  return (
    <SlideOver
      data-fs-product-comparison-sidebar
      fade={fade}
      size={size}
      direction={direction}
      isOpen={isOpen}
      overlayProps={overlayProps}
      {...otherProps}
    >
      <SlideOverHeader onClose={() => setIsOpen(false)}>
        <div>
          <h2>Compare Products</h2>
          <Badge size="big" variant="neutral">
            {products.length}
          </Badge>
        </div>
      </SlideOverHeader>

      <Dropdown>
        <DropdownButton icon={<Icon name="CaretDown" />}>
          Filters
        </DropdownButton>
        <DropdownMenu>
          <DropdownItem icon={<Icon name="ArrowElbowDownRight" />}>
            Dropdown Item 1
          </DropdownItem>
          <DropdownItem icon={<Icon name="ArrowElbowDownRight" />}>
            Dropdown Item 2
          </DropdownItem>
          <DropdownItem icon={<Icon name="ArrowElbowDownRight" />}>
            Dropdown Item 3
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <div data-fs-product-comparison-filters>
        <div>
          <p>Sort by</p>
          <Select
            id="product-comparison-sort-by"
            options={{
              productByName: 'Product name',
            }}
          />
        </div>
        <ToggleField
          id="product-comparison-show-differences"
          label="Show only differences"
        />
      </div>
      <Table>
        <TableHead>
          <TableRow>
            {products.map((product) => (
              <TableCell key={product.id}>
                <Image
                  width={250}
                  height={225}
                  src={product.image[0].url}
                  alt={product.name}
                />
                <h3>{product.name}</h3>
                {product.offers.lowPriceWithTaxes > product.offers.lowPrice ? (
                  <>
                    <div>
                      <Price
                        value={product.offers.lowPriceWithTaxes}
                        variant="listing"
                        formatter={formatter}
                      />
                      <Price
                        value={product.offers.lowPrice}
                        variant="selling"
                        formatter={formatter}
                      />
                    </div>
                    <Badge size="small" variant="neutral">
                      -10% OFF
                    </Badge>
                  </>
                ) : (
                  <Price
                    value={product.offers.lowPriceWithTaxes}
                    variant="selling"
                    formatter={formatter}
                  />
                )}
                <Button variant="tertiary" size="small">
                  Add to Cart
                </Button>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <h2>{technicalInformation?.title}</h2>
              <p>{technicalInformation?.description}</p>
            </TableCell>
          </TableRow>
          <TableRow>
            {products.map((product) => (
              <TableCell key={product.id}>
                <h3>Price With Taxes</h3>
                <Price
                  formatter={formatter}
                  value={product.offers.lowPriceWithTaxes}
                  variant="selling"
                />
              </TableCell>
            ))}
          </TableRow>
          {productsSpecifications?.map((spec) => (
            <TableRow key={spec}>
              {products.map((product) => (
                <TableCell key={product.id}>
                  <h3>{spec}</h3>
                  <p>
                    {product.additionalProperty.find(
                      (property) => property.name === spec && property.valueReference === "SPECIFICATION")?.value || '-'}
                  </p>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SlideOver>
  )
}

export default ProductComparisonSidebar
