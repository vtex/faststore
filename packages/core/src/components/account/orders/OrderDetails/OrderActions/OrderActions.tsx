import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  Icon as UIIcon,
  useUI,
} from '@faststore/ui'
import { useState } from 'react'
import OrderActionModal from 'src/components/account/orders/OrderDetails/OrderActionModal'
import { useCancelOrder } from 'src/sdk/account/useCancelOrder'
import { useReorder } from 'src/sdk/account/useReorder'
import type { ServerOrderDetailsQueryQuery } from '@generated/graphql'
import {
  type OrderDetailsHeaderLabels,
  resolveOrderDetailsHeaderLabels,
} from '../orderDetailsLabels'

type Order = ServerOrderDetailsQueryQuery['userOrder']

interface OrderActionsProps {
  allowCancellation: boolean
  orderId: string
  customerEmail?: string
  order: Order
  labels?: OrderDetailsHeaderLabels
}

export default function OrderActions({
  allowCancellation,
  orderId,
  customerEmail,
  order,
  labels: labelsProp,
}: OrderActionsProps) {
  const labels = resolveOrderDetailsHeaderLabels(labelsProp)
  const [isCancelOpen, setIsCancelOpen] = useState<boolean>(false)
  const { pushToast } = useUI()

  const { cancelOrder, loading } = useCancelOrder()
  const { reorder } = useReorder()

  const handleCancel = async () => {
    const data = {
      orderId,
      customerEmail,
      // TODO: We don't have a reason for action yet
      reason: '',
    }

    try {
      await cancelOrder({ data: data })

      setIsCancelOpen(false)
      pushToast({
        status: 'INFO',
        message: labels.cancelSuccessToast,
        icon: <UIIcon width={30} height={30} name="CircleWavyCheck" />,
      })

      window.location.reload()
    } catch (error) {
      pushToast({
        status: 'ERROR',
        message: labels.cancelErrorToast,
        icon: <UIIcon width={30} height={30} name="CircleWavyWarning" />,
      })
    }
  }

  const handleReorder = () => {
    reorder(order)
  }

  return (
    <>
      <div data-fs-order-actions>
        <Dropdown>
          <DropdownButton aria-label="View More" data-fs-dropdown-button>
            <UIIcon name="DotsThree" data-fs-dropdown-icon />
          </DropdownButton>
          <DropdownMenu align="right">
            <DropdownItem
              type="button"
              onClick={handleReorder}
              data-fs-order-actions-item
              data-fs-order-actions-item-reorder
            >
              {labels.reorderLabel}
            </DropdownItem>
            {allowCancellation && (
              <DropdownItem
                type="button"
                onClick={() => setIsCancelOpen(true)}
                data-fs-order-actions-item
                data-fs-order-actions-item-cancel
              >
                {labels.cancelOrderLabel}
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      </div>

      <OrderActionModal
        isOpen={isCancelOpen}
        loading={loading}
        title={labels.cancelOrderLabel}
        message={labels.cancelConfirmMessage}
        confirmText={labels.cancelOrderLabel}
        danger
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleCancel}
      />
    </>
  )
}
