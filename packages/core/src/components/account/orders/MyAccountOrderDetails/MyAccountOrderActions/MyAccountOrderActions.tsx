import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  Icon as UIIcon,
  useUI,
} from '@faststore/ui'
import { useState } from 'react'
import MyAccountOrderActionModal from 'src/components/account/orders/MyAccountOrderDetails/MyAccountOrderActionModal'
import { useCancelOrder } from 'src/sdk/account/useCancelOrder'
import { useReorder } from 'src/sdk/account/useReorder'

interface MyAccountOrderActionsProps {
  allowCancellation: boolean
  orderId: string
  customerEmail?: string
}

export default function MyAccountOrderActions({
  allowCancellation,
  orderId,
  customerEmail,
}: MyAccountOrderActionsProps) {
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
        message: 'Order canceled successfully',
        icon: <UIIcon width={30} height={30} name="CircleWavyCheck" />,
      })

      window.location.reload()
    } catch (error) {
      pushToast({
        status: 'ERROR',
        message: "Order couldn't be canceled due to a technical issue.",
        icon: <UIIcon width={30} height={30} name="CircleWavyWarning" />,
      })
    }
  }

  const handleReorder = () => {
    reorder(orderId)
  }

  // Always render dropdown since reorder is always available

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
              style={{
                color: 'var(--fs-color-text)',
              }}
            >
              Reorder
            </DropdownItem>
            {allowCancellation && (
              <DropdownItem
                type="button"
                onClick={() => setIsCancelOpen(true)}
                style={{
                  color: 'var(--fs-color-text)',
                }}
              >
                Cancel order
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      </div>

      <MyAccountOrderActionModal
        isOpen={isCancelOpen}
        loading={loading}
        title="Cancel order"
        message="Are you sure you want to cancel this order? This action can't be undone."
        confirmText="Cancel order"
        danger
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleCancel}
      />
    </>
  )
}
