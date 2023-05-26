import {
  Icon as UIIcon,
  Badge as UIBadge,
  IconButton as UIIconButton,
} from '@faststore/ui'

import { useCartToggleButton } from 'src/sdk/cart/useCartToggleButton'

function CartToggle({ alt, icon }: { alt: string; icon: string }) {
  const btnProps = useCartToggleButton()
  const totalItems = btnProps['data-items']

  return (
    <UIIconButton
      data-fs-cart-toggle
      aria-label={alt}
      icon={<UIIcon name={icon} width={32} height={32} />}
      {...btnProps}
    >
      <UIBadge counter>{totalItems}</UIBadge>
    </UIIconButton>
  )
}

export default CartToggle
