import {
  Badge as UIBadge,
  Icon,
  IconButton as UIIconButton,
} from '@faststore/ui'

import { useCartToggleButton } from 'src/sdk/cart/useCartToggleButton'

function CartToggle() {
  const btnProps = useCartToggleButton()
  const totalItems = btnProps['data-items']

  return (
    <UIIconButton
      data-fs-cart-toggle
      aria-label={`Cart with ${totalItems} items`}
      icon={<Icon name="ShoppingCart" width={32} height={32} />}
      {...btnProps}
    >
      <UIBadge counter>{totalItems}</UIBadge>
    </UIIconButton>
  )
}

export default CartToggle
