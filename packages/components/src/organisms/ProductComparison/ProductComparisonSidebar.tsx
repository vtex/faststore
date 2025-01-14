import React, { useEffect, useState } from 'react'
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
import { IProductComparison } from './provider/ProductComparisonProvider'
// import Dropdown, {
//   DropdownButton,
//   DropdownItem,
//   DropdownMenu,
// } from '../../molecules/Dropdown'
// import Icon from '../../atoms/Icon'

export interface sortOptions {
  label: string
  value: string
  function: (productComparison: IProductComparison[]) => IProductComparison[]
}

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
  /**
   * Custom function to sort the products.
   */
  sortOptions?: sortOptions[]
}

function ProductComparisonSidebar({
  technicalInformation,
  size = 'partial',
  direction = 'rightSide',
  formatter,
  overlayProps,
  sortOptions,
  ...otherProps
}: ProductComparisonSidebarProps) {
  const { fade } = useFadeEffect()

  const { isOpen, setIsOpen, products } = useProductComparison()

  const [selectedFilter, setSelectedFilter] = useState<
    keyof typeof sortOptions
  >(() => 'productByName' as keyof typeof sortOptions)
  const [productSorted, setProductSorted] =
    useState<IProductComparison[]>(products || [])
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false)
  const [productsSpecifications, setProductsSpecifications] = useState<string[]>([])

  const sortProduct = () => {
    const sortFunction = sortOptions?.find(
      (option) => option.value === selectedFilter
    )?.function
    if (sortFunction) {
      setProductSorted(sortFunction(products))
    }
  }

  //TODO ICARO: CHANGE TO USECALLBACK/USEMEMO
  useEffect(() => {
    sortProduct()
  }, [selectedFilter, products])

  //TODO ICARO: CHANGE TO USECALLBACK/USEMEMO
  useEffect(() => {
    if(!showOnlyDifferences){
      setProductsSpecifications(products[0]?.skuSpecifications?.map((spec) => spec.field) || [])
    } else {
      const allSpecifications = products[0]?.skuSpecifications?.map((spec) => spec.field)
      const productsSpecs = productSorted.map(product => product.additionalProperty.map((property) => [property.name, property.value || ""]))

      const differences = allSpecifications?.filter((spec) => {
        const values = productsSpecs.map((product) => product.find((value) => value[0] === spec)?.[1])
        return !values.every((value, _, array) => value === array[0])
      }) || []

      setProductsSpecifications(differences)
    }
  }, [showOnlyDifferences])

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

      {/* <Dropdown>
        <DropdownButton icon={<Icon name="CaretDown" />}>
          Filters
        </DropdownButton>
        <DropdownMenu>
          <DropdownItem icon={<Icon name="ArrowElbowDownRight" />}>
            Dropdown Item 1
          </DropdownItem>

        </DropdownMenu>
      </Dropdown> */}

      <div data-fs-product-comparison-filters>
        <div>
          <p>Sort by</p>
          <Select
            id="product-comparison-sort-by"
            options={
              sortOptions?.reduce(
                (acc: Record<string, string>, option) => {
                  acc[option.value] = option.label
                  return acc
                },
                {} as Record<string, string>
              ) || {}
            }
            value={selectedFilter}
            onChange={(event) =>
              setSelectedFilter(event.target.value as keyof typeof sortOptions)
            }
          />
        </div>
        <ToggleField
          id="product-comparison-show-differences"
          label="Show only differences"
          checked={showOnlyDifferences}
          onChange={() => setShowOnlyDifferences(!showOnlyDifferences)}
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
                <h3>
                  {product.name}{' '}
                  {product.additionalProperty
                    .map((index) => index.value)
                    .join(' ')}
                </h3>
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
              <h3>{technicalInformation?.description}</h3>
            </TableCell>
          </TableRow>
          <TableRow>
            {productSorted.map((product) => (
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
              {productSorted.map((product) => (
                <TableCell key={product.id}>
                  <h3>{spec}</h3>
                  <p>
                    {product.additionalProperty.find(
                      (property) =>
                        property.name === spec &&
                        property.valueReference === 'SPECIFICATION'
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

export default ProductComparisonSidebar
