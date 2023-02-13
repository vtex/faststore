import { Card, CardContent, CardImage } from '@faststore/ui'

import { Image } from 'src/components/ui/Image'
import Link from 'src/components/ui/Link'
import Price from 'src/components/ui/Price'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useProductLink } from 'src/sdk/product/useProductLink'
import useSearchInput from 'src/sdk/search/useSearchInput'
import type { ProductSummary_ProductFragment } from '@generated/graphql'

import styles from './search-product-card.module.scss'

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
  const { onClick, href, ...linkProps } = useProductLink({
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
    <Card
      data-fs-search-product-card
      className={styles.fsSearchProductCard}
      data-testid="search-product-card"
      {...otherProps}
    >
      <Link
        {...linkProps}
        data-fs-search-product-card-link
        href={href}
        title={name}
        variant="display"
        onClick={() => {
          onClick()
          onSearchInputSelection?.(name, href)
        }}
      >
        <CardContent data-fs-search-product-card-content>
          <CardImage data-fs-search-product-card-image>
            <Image
              src={img.url}
              alt={img.alternateName}
              width={56}
              height={56}
            />
          </CardImage>
          <div data-fs-search-product-card-summary>
            <p className="text__title-mini" data-fs-search-product-card-title>
              {name}
            </p>
            <span data-fs-search-product-card-prices>
              <Price
                value={listPrice}
                formatter={useFormattedPrice}
                testId="list-price"
                data-value={listPrice}
                variant="listing"
                classes="text__legend"
                SRText="Original price:"
              />
              <Price
                value={spotPrice}
                formatter={useFormattedPrice}
                testId="price"
                data-value={spotPrice}
                variant="spot"
                classes="text__title-mini"
                SRText="Price:"
              />
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

export default SearchProductCard
