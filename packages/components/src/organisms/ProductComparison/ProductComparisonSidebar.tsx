import React, {
  type FunctionComponent,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useFadeEffect, useProductComparison } from '../../hooks'
import SlideOver, { SlideOverHeader, type SlideOverProps } from '../SlideOver'
import type { IProductComparison } from './provider/ProductComparisonProvider'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '../../molecules/Table'
import ToggleField from '../../molecules/ToggleField'

import Badge from '../../atoms/Badge'
import Button from '../../atoms/Button'
import Select from '../../atoms/Select'
import Price, { type PriceFormatter } from '../../atoms/Price'

const SPECIFICATION = 'SPECIFICATION'

export interface SortOptions {
  label: string
  value: string
  onChange: (productComparison: IProductComparison[]) => IProductComparison[]
}

type ImageComponentType = FunctionComponent<{
  src: string
  alt: string
  width?: number
  height?: number
}>

export interface ProductComparisonSidebarProps
  extends Omit<SlideOverProps, 'children' | 'isOpen' | 'setIsOpen' | 'fade'> {
  /**
   * Defines the title of the SlideOver.
   */
  title: string
  /**
   * Defines the sort label.
   */
  sortLabel: string
  /**
   * Defines the label from add to cart button.
   */
  cartButtonLabel: string
  /**
   * Defines the label for the price including taxes.
   */
  priceWithTaxLabel: string
  /**
   * Formatter function that transforms the raw price value and render the result.
   */
  priceFormatter?: PriceFormatter
  /**
   * Custom labels to introducing about products.
   */
  technicalInformation?: {
    title: string
    description: string
  }
  /**
   * Custom function to sort the products.
   */
  sortOptions?: SortOptions[]
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
   * Function to select the product that will be added to the cart.
   */
  handleProductToBuy: (productId: string) => void
}

const ImageComponent: ImageComponentType =
  ({ src, alt, ...otherProps }) => <img src={src} alt={alt} {...otherProps} />

function ProductComparisonSidebar({
  title,
  sortLabel,
  cartButtonLabel,
  priceWithTaxLabel,
  technicalInformation,
  size = 'partial',
  direction = 'rightSide',
  priceFormatter,
  overlayProps,
  sortOptions,
  buyProps: { onClick },
  handleProductToBuy,
  ...otherProps
}: ProductComparisonSidebarProps) {
  const { fade } = useFadeEffect()
  const { isOpen, setIsOpen, products } = useProductComparison()

  const [selectedFilter, setSelectedFilter] =
    useState<SortOptions['value']>('productByName')
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false)
  const [productsSpecs, setProductsSpecs] = useState<string[]>([])
  const [differenceSpecs, setDifferenceSpecs] = useState<string[]>([])

  const handleClickAddCart = (
    event: React.MouseEvent<HTMLButtonElement>,
    product: IProductComparison
  ) => {
    event.preventDefault()
    handleProductToBuy(product.id)
    onClick(event)
  }

  const productSorted = useMemo(
    () =>
      sortOptions
        ?.find((option) => option.value === selectedFilter)
        ?.onChange(products) ?? products,
    [selectedFilter, products]
  )

  useEffect(() => {
    const firstProduct = products[0]

    setProductsSpecs(getAllSpecifications(firstProduct))
    setDifferenceSpecs(getDifferences(firstProduct, productSorted))
  }, [showOnlyDifferences, productSorted, products])

  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling when the drawer is open
      document.body.style.overflow = 'hidden'
      return
    }

    // Restore scrolling when the drawer is closed
    document.body.style.overflow = ''
  }, [isOpen])

  const options = useMemo(
    () =>
      sortOptions?.reduce(
        (acc: Record<string, string>, option) => {
          acc[option.value] = option.label
          return acc
        },
        {} as Record<string, string>
      ) || {},
    [sortOptions]
  )

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
        <h2>{title}</h2>
        <Badge size="big" variant="neutral">
          {products.length}
        </Badge>
      </SlideOverHeader>

      <div data-fs-product-comparison-filters>
        <div>
          <p>{sortLabel}</p>
          <Select
            id="product-comparison-sort-by"
            options={options}
            value={selectedFilter}
            onChange={(event) =>
              setSelectedFilter(event.target.value as SortOptions['value'])
            }
          />
        </div>
        <ToggleField
          id="product-comparison-show-differences"
          label="Show only differences"
          checked={showOnlyDifferences}
          onChange={() => setShowOnlyDifferences((prev) => !prev)}
        />
      </div>

      <Table>
        <TableHead>
          <TableRow>
            {products.map((product) => {
              const highestListPrice = Math.max(
                ...product.offers.offers.map((offer) => offer.listPrice)
              )

              const showDiscount = highestListPrice > product.offers.lowPrice

              const discount = Math.round(
                (1 - product.offers.lowPrice / highestListPrice) * 100
              )
              return (
                <TableCell key={product.id}>
                  <ImageComponent
                    width={250}
                    height={225}
                    src={product.image[0]?.url ?? ''}
                    alt={product.name}
                  />
                  <h3>
                    {product.name}{' '}
                    {product.additionalProperty
                      .map((index) => index.value)
                      .join(' ')}
                  </h3>

                  {showDiscount ? (
                    <>
                      <div>
                        <Price
                          value={product.offers.offers[0].listPrice}
                          variant="listing"
                          formatter={priceFormatter}
                        />
                        <Price
                          value={product.offers.lowPrice}
                          variant="selling"
                          formatter={priceFormatter}
                        />
                      </div>
                      <Badge size="small" variant="neutral">
                        -{discount}% OFF
                      </Badge>
                    </>
                  ) : (
                    <Price
                      value={product.offers.lowPriceWithTaxes}
                      variant="selling"
                      formatter={priceFormatter}
                    />
                  )}

                  <Button
                    variant="tertiary"
                    size="small"
                    onClick={(event) => handleClickAddCart(event, product)}
                  >
                    {cartButtonLabel}
                  </Button>
                </TableCell>
              )
            })}
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <TableCell>
              <h2>{technicalInformation?.title}</h2>
              <h3>{technicalInformation?.description}</h3>
            </TableCell>
          </TableRow>

          <TableRow>
            {productSorted.map((product) => (
              <TableCell key={product.id}>
                <h3>{priceWithTaxLabel}</h3>
                <Price
                  formatter={priceFormatter}
                  value={product.offers.lowPriceWithTaxes}
                  variant="selling"
                />
              </TableCell>
            ))}
          </TableRow>

          {showOnlyDifferences
            ? differenceSpecs?.map((spec) => (
                <TableRow key={spec}>
                  {productSorted.map((product) => (
                    <TableCell key={product.id}>
                      <h3>{spec}</h3>
                      <p>
                        {product.additionalProperty.find(
                          (property) =>
                            property.name === spec &&
                            property.valueReference === SPECIFICATION
                        )?.value || '-'}
                      </p>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : productsSpecs?.map((spec) => (
                <TableRow key={spec}>
                  {productSorted.map((product) => (
                    <TableCell key={product.id}>
                      <h3>{spec}</h3>
                      <p>
                        {product.additionalProperty.find(
                          (property) =>
                            property.name === spec &&
                            property.valueReference === SPECIFICATION
                        )?.value || '-'}
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

const getAllSpecifications = (product: IProductComparison) => {
  return product?.skuSpecifications?.map((spec) => spec.field) || []
}

const getDifferences = (
  product: IProductComparison,
  productsSorted: IProductComparison[]
) => {
  const allSpecifications = getAllSpecifications(product)
  const productsSpecs = productsSorted.map((product) =>
    product.additionalProperty.map((property) => [
      property.name,
      property.value || '',
    ])
  )

  return (
    allSpecifications.filter((spec) => {
      const values = productsSpecs.map(
        (product) => product.find((value) => value[0] === spec)?.[1]
      )
      return !values.every((value, _, array) => value === array[0])
    }) || []
  )
}

export default ProductComparisonSidebar
