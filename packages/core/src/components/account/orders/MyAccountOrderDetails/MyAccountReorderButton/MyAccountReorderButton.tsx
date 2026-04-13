import { Button } from '@faststore/ui'
import { useIntl } from 'react-intl'
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
  const intl = useIntl()

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
      {intl.formatMessage({ id: 'myaccount.orderDetails.actions.reorder' })}
    </Button>
  )
}
