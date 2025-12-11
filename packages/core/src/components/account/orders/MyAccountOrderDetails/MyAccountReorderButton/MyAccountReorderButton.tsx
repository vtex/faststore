import { Button } from '@faststore/ui'
import { useReorder } from 'src/sdk/account/useReorder'

export interface MyAccountReorderButtonProps {
  orderId: string
  onClick?: () => void
}

export default function MyAccountReorderButton({
  orderId,
  onClick,
}: MyAccountReorderButtonProps) {
  const { reorder, loading } = useReorder()

  const handleClick = () => {
    reorder(orderId)
    if (onClick) {
      onClick()
    }
  }

  return (
    <Button
      variant="secondary"
      data-fs-reorder-button
      onClick={handleClick}
      disabled={loading}
    >
      Reorder
    </Button>
  )
}
