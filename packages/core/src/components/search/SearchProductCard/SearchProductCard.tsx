import {
  SearchProductCard as UISearchProductCard,
  SearchProductCardContent as UISearchProductCardContent,
  SearchProductCardImage as UISearchProductCardImage,
} from '@faststore/ui'

import { Image } from 'src/components/ui/Image'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useProductLink } from 'src/sdk/product/useProductLink'
import useSearchInput from 'src/sdk/search/useSearchInput'
import type { ProductSummary_ProductFragment } from '@generated/graphql'

type SearchProductCardProps = {
  /**
   * Product to be showed in `SearchProductCard`.
   */
  product: ProductSummary_ProductFragment
  /**
   * Index to generate product link.
   */
  index: number
}

function SearchProductCard({
  product,
  index,
  ...otherProps
}: SearchProductCardProps) {
  const { onSearchInputSelection } = useSearchInput()
  const linkProps = useProductLink({
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

  return (
    <UISearchProductCard
      linkProps={linkProps}
      onLinkClick={() => {
        linkProps.onClick
        onSearchInputSelection?.(name, linkProps.href)
      }}
      {...otherProps}
    >
      <UISearchProductCardImage>
        <Image src={img.url} alt={img.alternateName} width={56} height={56} />
      </UISearchProductCardImage>
      <UISearchProductCardContent
        title={name}
        price={{
          value: spotPrice,
          listPrice: listPrice,
          formatter: useFormattedPrice,
        }}
      ></UISearchProductCardContent>
    </UISearchProductCard>
  )
}

export default SearchProductCard
