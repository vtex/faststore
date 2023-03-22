import {
  SearchProductItem as UISearchProductItem,
  SearchProductItemContent as UISearchProductItemContent,
  SearchProductItemImage as UISearchProductItemImage,
  useSearch,
} from '@faststore/ui'

import { Image } from 'src/components/ui/Image'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useProductLink } from 'src/sdk/product/useProductLink'
import type { ProductSummary_ProductFragment } from '@generated/graphql'

type SearchProductItemProps = {
  /**
   * Product to be showed in `SearchProductItem`.
   */
  product: ProductSummary_ProductFragment
  /**
   * Index to generate product link.
   */
  index: number
}

function SearchProductItem({
  product,
  index,
  ...otherProps
}: SearchProductItemProps) {
  const {
    values: { onSearchSelection },
  } = useSearch()

  const { href, onClick, ...baseLinkProps } = useProductLink({
    product,
    selectedOffer: 0,
    index,
  })

  const {
    isVariantOf: { name },
    image: [img],
    offers: {
      lowPrice: spotPrice,
      offers: [{ listPrice }],
    },
  } = product

  const linkProps = {
    href,
    onClick: () => {
      onClick()
      onSearchSelection?.(name, href)
    },
    ...baseLinkProps,
  }

  return (
    <UISearchProductItem linkProps={linkProps} {...otherProps}>
      <UISearchProductItemImage>
        <Image src={img.url} alt={img.alternateName} width={56} height={56} />
      </UISearchProductItemImage>
      <UISearchProductItemContent
        title={name}
        price={{
          value: spotPrice,
          listPrice: listPrice,
          formatter: useFormattedPrice,
        }}
      ></UISearchProductItemContent>
    </UISearchProductItem>
  )
}

export default SearchProductItem
