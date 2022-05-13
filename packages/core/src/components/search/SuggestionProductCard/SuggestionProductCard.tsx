import { Card, CardContent, CardImage } from '@faststore/ui'

import styles from 'src/components/search/SuggestionProductCard/suggestion-product-card.module.scss'
import { Image } from 'src/components/ui/Image'
import Link from 'src/components/ui/Link'
import Price from 'src/components/ui/Price'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useProductLink } from 'src/sdk/product/useProductLink'
import type { ProductSummary_ProductFragment } from '@generated/graphql'

type SuggestionProductCardProps = {
  product: ProductSummary_ProductFragment
  index: number
}

function SuggestionProductCard({ product, index }: SuggestionProductCardProps) {
  const linkProps = useProductLink({ product, selectedOffer: 0, index })
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
      className={styles['fs-suggestion-product-card']}
      data-fs-suggestion-product-card
      data-testid="suggestion-product-card"
    >
      <Link {...linkProps} title={name} variant="display">
        <CardContent>
          <CardImage>
            <Image
              src={img.url}
              alt={img.alternateName}
              width={56}
              height={56}
            />
          </CardImage>
          <div data-fs-suggestion-product-card-summary>
            <p
              className="text__title-mini"
              data-fs-suggestion-product-card-title
            >
              {name}
            </p>
            <span data-fs-suggestion-product-card-prices>
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

export default SuggestionProductCard
