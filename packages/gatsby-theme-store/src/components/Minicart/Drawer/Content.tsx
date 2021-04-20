import React from 'react'
import { Flex, Text, Box } from 'theme-ui'
import type { FC } from 'react'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

import { useNumberFormat } from '../../../sdk/localization/useNumberFormat'
import MinicartDelete from './Delete'
import { HeaderMinicartDrawerContentImage } from './Image'
import MinicartQuantity from './Quantity'
import { IMAGE_DEFAULT } from '../../../sdk/product/constants'
import type {
  Product,
  OrderFormData,
} from '../../../sdk/product/useAvailability'
import { useAvailability } from '../../../sdk/product/useAvailability'

export interface MinicartContentProps {
  data: OrderFormData
  variant: string
  imageElement: React.ElementType
}

export interface ItemsProps {
  items: Product[]
  variant: string
  imageElement: React.ElementType
  formats: { format: (value: number) => string; formatMessage: any }
}

export interface ItemProps {
  item: Product
  variant: string
  formats: { format: (value: number) => string; formatMessage: any }
}

export const freeVariant = (price: Maybe<number>) =>
  price === 0 ? '.free' : ''

export const ItemInfo = ({
  item: { product, index },
  variant,
  formats: { format, formatMessage },
}: ItemProps) => (
  <>
    <Flex>
      <Text variant={`${variant}.product.name.text`}>{product.name}</Text>
      <MinicartDelete index={index} variant={variant} />
    </Flex>
    <MinicartQuantity
      index={index}
      isDisabled={
        product.sellingPrice === 0 || product.availability !== 'available'
      }
      variant={`${variant}${freeVariant(product.sellingPrice)}`}
    />
    <Text
      variant={`${variant}.product.name.value${freeVariant(
        product.sellingPrice
      )}`}
    >
      {product.sellingPrice === 0
        ? formatMessage({ id: 'minicart.price.free' })
        : format(Number(product.sellingPrice) / 100)}
    </Text>
  </>
)

export const AvailableItems = ({
  items,
  variant,
  imageElement,
  formats,
}: ItemsProps) => (
  <Box>
    {items.map(({ product, index }: Product) => (
      <Flex key={product.id} variant={`${variant}.product`}>
        <HeaderMinicartDrawerContentImage
          as={imageElement}
          src={product.imageUrls?.at2x ?? IMAGE_DEFAULT}
          alt={product.name!}
          variant={`${variant}.product.image`}
        />
        <Flex variant={`${variant}.product.name`}>
          <ItemInfo
            item={{ product, index }}
            variant={variant}
            formats={formats}
          />
        </Flex>
      </Flex>
    ))}
  </Box>
)

export const UnavailableItems = ({
  items,
  variant,
  imageElement,
  formats,
}: ItemsProps) => (
  <Box>
    {items.map(({ product, index }: Product) => (
      <Flex key={product.id} variant={`${variant}.product`}>
        <HeaderMinicartDrawerContentImage
          as={imageElement}
          src={product.imageUrls?.at2x ?? IMAGE_DEFAULT}
          alt={product.name!}
          variant={`${variant}.product.image`}
        />
        <Flex variant={`${variant}.product.name`}>
          <ItemInfo
            item={{ product, index }}
            variant={variant}
            formats={formats}
          />
          <Flex variant={`${variant}.product.availabilityContainer`}>
            <Text variant={`${variant}.product.availabilityContainer.message`}>
              Este produto não pode ser entregue no endereço fornecido.
            </Text>
          </Flex>
        </Flex>
      </Flex>
    ))}
  </Box>
)

export const HeaderMinicartDrawerContent: FC<MinicartContentProps> = ({
  data,
  variant: v,
  imageElement,
}) => {
  const { format } = useNumberFormat()
  const { formatMessage } = useIntl()
  const { available, unavailable } = useAvailability(data)
  const variant = `${v}.content`

  return (
    <Flex variant={variant}>
      {unavailable.length > 0 && (
        <UnavailableItems
          items={unavailable}
          imageElement={imageElement}
          variant={variant}
          formats={{ format, formatMessage }}
        />
      )}
      {unavailable.length > 0 && available.length > 0 && (
        <Box variant={`${variant}.section`}>
          {available.length}
          {available.length > 1
            ? ' produtos disponíveis'
            : ' produto disponível'}
        </Box>
      )}
      {available.length > 0 && (
        <AvailableItems
          items={available}
          imageElement={imageElement}
          variant={variant}
          formats={{ format, formatMessage }}
        />
      )}
    </Flex>
  )
}
