import { Button } from '@faststore/ui'
import { useReorder } from 'src/sdk/account/useReorder'
import type { ServerOrderDetailsQueryQuery } from '@generated/graphql'

type Order = ServerOrderDetailsQueryQuery['userOrder']

export interface MyAccountReorderButtonProps {
  order: Order
  onClick?: () => void
}

export default function MyAccountReorderButton({
  order,
  onClick,
}: MyAccountReorderButtonProps) {
  const { reorder, loading } = useReorder()

  const handleClick = () => {
    reorder(order)
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
