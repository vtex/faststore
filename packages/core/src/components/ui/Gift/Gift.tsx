import type { GiftProps } from '@vtex/faststore-ui'
import {
  Icon,
  Gift as UIGift,
  GiftContent as UIGiftContent,
  GiftImage as UIGiftImage,
} from '@vtex/faststore-ui'

import { Image } from '../Image'
import type { CartItem as ICartItem } from '../../../sdk/cart'
import { useFormattedPrice } from '../../../sdk/product/useFormattedPrice'

export type Props = GiftProps & {
  /**
   * Product to be showed as `Gift`.
   */
  item: ICartItem
}

function Gift({ item, ...otherProps }: Props) {
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
      <UIGiftContent
        productName={item.itemOffered.isVariantOf.name}
        price={{
          value: item.price,
          listPrice: item.listPrice,
          formatter: useFormattedPrice,
        }}
      />
    </UIGift>
  )
}

export default Gift
