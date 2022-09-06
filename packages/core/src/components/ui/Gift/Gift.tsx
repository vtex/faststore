import {
  Gift as UIGift,
  GiftImage as UIGiftImage,
  GiftContent as UIGiftContent,
} from '@faststore/ui'
import type { GiftProps } from '@faststore/ui'

import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import Icon from 'src/components/ui/Icon'
import Price from 'src/components/ui/Price'
import { Badge } from 'src/components/ui/Badge'
import { Image } from 'src/components/ui/Image'
import type { ProductSummary_ProductFragment } from '@generated/graphql'

import styles from './gift.module.scss'

export type Props = GiftProps & {
  /**
   * Product to be showed as `Gift`.
   */
  product: ProductSummary_ProductFragment
  /**
   * Additional message in the title
   */
  titleMessage?: string
  /**
   * Badge's label
   */
  badgeLabel?: string
}

function Gift({
  product,
  titleMessage = 'Get a',
  badgeLabel = 'Free',
  ...otherProps
}: Props) {
  const {
    isVariantOf,
    image: [img],
    offers: {
      offers: [{ listPrice }],
    },
  } = product

  return (
    <UIGift
      className={styles.fsGift}
      icon={<Icon name="Tag" width={18} height={18} />}
      {...otherProps}
    >
      <UIGiftImage>
        <Image src={img.url} alt={img.alternateName} width={89} height={89} />
      </UIGiftImage>
      <UIGiftContent>
        <h3 data-fs-gift-product-title>
          {titleMessage} {isVariantOf.name}
        </h3>
        <span data-fs-gift-product-summary>
          <Price
            value={listPrice}
            formatter={useFormattedPrice}
            testId="list-price"
            data-value={listPrice}
            variant="listing"
            classes="text__legend"
            SRText="Original price:"
          />
          <Badge>{badgeLabel}</Badge>
        </span>
      </UIGiftContent>
    </UIGift>
  )
}

export default Gift
