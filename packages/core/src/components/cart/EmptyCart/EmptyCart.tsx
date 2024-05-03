import {
  Button as UIButton,
  Icon as UIIcon,
  EmptyState as UIEmptyState,
} from '@faststore/ui'

interface Props {
  /**
   * This function is called when `Start Shopping` button is clicked
   */
  onDismiss: () => void
}

function EmptyCart({ onDismiss }: Props) {
  return (
    <UIEmptyState
      title="Your Cart is empty"
      titleIcon={<UIIcon name="fs-shopping-cart" size={32} />}
    >
      <UIButton onClick={onDismiss} variant="secondary">
        Start Shopping
      </UIButton>
    </UIEmptyState>
  )
}

export default EmptyCart
