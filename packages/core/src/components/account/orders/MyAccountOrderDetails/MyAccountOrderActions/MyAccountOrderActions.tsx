import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  Icon as UIIcon,
  useUI,
} from '@faststore/ui'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import MyAccountOrderActionModal from 'src/components/account/orders/MyAccountOrderDetails/MyAccountOrderActionModal'
import { useCancelOrder } from 'src/sdk/account/useCancelOrder'
import { useReorder } from 'src/sdk/account/useReorder'
import type { ServerOrderDetailsQueryQuery } from '@generated/graphql'

type Order = ServerOrderDetailsQueryQuery['userOrder']

interface MyAccountOrderActionsProps {
  allowCancellation: boolean
  orderId: string
  customerEmail?: string
  order: Order
}

export default function MyAccountOrderActions({
  allowCancellation,
  orderId,
  customerEmail,
  order,
}: MyAccountOrderActionsProps) {
  const [isCancelOpen, setIsCancelOpen] = useState<boolean>(false)
  const { pushToast } = useUI()
  const intl = useIntl()

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
        message: intl.formatMessage({
          id: 'myaccount.orderDetails.actions.cancelSuccess',
        }),
        icon: <UIIcon width={30} height={30} name="CircleWavyCheck" />,
      })

      window.location.reload()
    } catch (error) {
      pushToast({
        status: 'ERROR',
        message: intl.formatMessage({
          id: 'myaccount.orderDetails.actions.cancelError',
        }),
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
          <DropdownButton
            aria-label={intl.formatMessage({
              id: 'myaccount.orderDetails.actions.viewMore',
            })}
            data-fs-dropdown-button
          >
            <UIIcon name="DotsThree" data-fs-dropdown-icon />
          </DropdownButton>
          <DropdownMenu align="right">
            <DropdownItem
              type="button"
              onClick={handleReorder}
              data-fs-order-actions-item
              data-fs-order-actions-item-reorder
            >
              {intl.formatMessage({
                id: 'myaccount.orderDetails.actions.reorder',
              })}
            </DropdownItem>
            {allowCancellation && (
              <DropdownItem
                type="button"
                onClick={() => setIsCancelOpen(true)}
                data-fs-order-actions-item
                data-fs-order-actions-item-cancel
              >
                {intl.formatMessage({
                  id: 'myaccount.orderDetails.actions.cancelOrder',
                })}
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      </div>

      <MyAccountOrderActionModal
        isOpen={isCancelOpen}
        loading={loading}
        title={intl.formatMessage({
          id: 'myaccount.orderDetails.actions.cancelOrder',
        })}
        message={intl.formatMessage({
          id: 'myaccount.orderDetails.actions.cancelConfirmMessage',
        })}
        confirmText={intl.formatMessage({
          id: 'myaccount.orderDetails.actions.cancelOrder',
        })}
        danger
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleCancel}
      />
    </>
  )
}
