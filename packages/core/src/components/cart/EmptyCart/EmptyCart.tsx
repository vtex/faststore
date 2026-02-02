import {
  Button as UIButton,
  Icon as UIIcon,
  EmptyState as UIEmptyState,
} from '@faststore/ui'

interface Props {
  /**
   * Title text for empty cart state
   */
  title?: string
  /**
   * Button label for empty cart action
   */
  buttonLabel?: string
  /**
   * This function is called when the button is clicked
   */
  onDismiss: () => void
}

function EmptyCart({ title, buttonLabel, onDismiss }: Props) {
  return (
    <UIEmptyState
      title={title}
      titleIcon={
        <UIIcon name="ShoppingCart" width={56} height={56} weight="thin" />
      }
    >
      <UIButton onClick={onDismiss} variant="secondary">
        {buttonLabel}
      </UIButton>
    </UIEmptyState>
  )
}

export default EmptyCart
