import type { GiftProps } from '@faststore/ui'
import {
  Badge as UIBadge,
  Gift as UIGift,
  GiftContent as UIGiftContent,
  GiftImage as UIGiftImage,
} from '@faststore/ui'

import Icon from 'src/components/ui/Icon'
import { Image } from 'src/components/ui/Image'
import Price from 'src/components/ui/Price'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import type { CartItem as ICartItem } from 'src/sdk/cart'

export type Props = GiftProps & {
  /**
   * Product to be showed as `Gift`.
   */
  item: ICartItem
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
  item,
  titleMessage = 'Get a',
  badgeLabel = 'Free',
  ...otherProps
}: Props) {
  return (
    <UIGift icon={<Icon name="Tag" width={18} height={18} />} {...otherProps}>
      <UIGiftImage>
        <Image
          src={item.itemOffered.image[0].url}
          alt={item.itemOffered.image[0].alternateName}
          width={89}
          height={89}
        />
      </UIGiftImage>
      <UIGiftContent>
        <h3 data-fs-gift-product-title>
          {titleMessage} {item.itemOffered.isVariantOf.name}
        </h3>
        <span data-fs-gift-product-summary>
          <Price
            value={item.price}
            formatter={useFormattedPrice}
            testId="list-price"
            data-value={item.price}
            variant="listing"
            classes="text__legend"
            SRText="Original price:"
          />
          <UIBadge>{badgeLabel}</UIBadge>
        </span>
      </UIGiftContent>
    </UIGift>
  )
}

export default Gift
