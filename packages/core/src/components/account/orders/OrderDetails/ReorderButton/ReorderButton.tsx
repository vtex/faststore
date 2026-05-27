import { Button } from '@faststore/ui'
import { useReorder } from 'src/sdk/account/useReorder'
import type { ServerOrderDetailsQueryQuery } from '@generated/graphql'

type Order = ServerOrderDetailsQueryQuery['userOrder']

export interface ReorderButtonProps {
  order: Order
  onClick?: () => void
  label?: string
}

export default function ReorderButton({
  order,
  onClick,
  label = 'Reorder',
}: ReorderButtonProps) {
  const { reorder, loading } = useReorder()

  const handleClick = async () => {
    try {
      await reorder(order)
      onClick?.()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Button
      variant="secondary"
      data-fs-reorder-button
      onClick={handleClick}
      disabled={loading}
    >
      {label}
    </Button>
  )
}
