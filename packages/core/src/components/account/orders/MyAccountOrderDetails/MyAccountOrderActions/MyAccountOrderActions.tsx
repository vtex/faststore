import {
  Button as UIButton,
  Icon as UIIcon,
  useUI,
  IconButton as UIIconButton,
} from '@faststore/ui'
import useScreenResize from 'src/sdk/ui/useScreenResize'
import MyAccountOrderActionModal, {
  useOrderActionModal,
} from 'src/components/account/orders/MyAccountOrderDetails/MyAccountOrderActionModal'
import { useCancelOrder } from 'src/sdk/account/useCancelOrder'
import { useApproveOrder } from 'src/sdk/account/useApproveOrder'
import { useRejectOrder } from 'src/sdk/account/useRejectOrder'

const TOASTS_CONFIG = {
  cancel: {
    success: 'Order canceled successfully',
    error: "Order couldn't be canceled due to a technical issue. Try again.",
  },
  approve: {
    success: 'Order approved successfully',
    error: "Order couldn't be approved due to a technical issue. Try again.",
  },
  reject: {
    success: 'Order rejected successfully',
    error: "Order couldn't be rejected due to a technical issue. Try again.",
  },
}

interface MyAccountOrderActionsProps {
  allowCancellation: boolean
  orderId: string
  canProcessOrderAuthorization: boolean
  customerEmail?: string
}

export default function MyAccountOrderActions({
  allowCancellation,
  orderId,
  canProcessOrderAuthorization,
  customerEmail,
}: MyAccountOrderActionsProps) {
  const { isMobile, isTablet } = useScreenResize()
  const { isOpen, actionType, fade, openDialog, closeDialog } =
    useOrderActionModal()
  const { pushToast } = useUI()

  const { cancelOrder, loading: cancelLoading } = useCancelOrder()
  const { approveOrder, loading: approveLoading } = useApproveOrder()
  const { rejectOrder, loading: rejectLoading } = useRejectOrder()

  const loading =
    (actionType === 'cancel' && cancelLoading) ||
    (actionType === 'approve' && approveLoading) ||
    (actionType === 'reject' && rejectLoading)

  const handleConfirm = async (type: string) => {
    const data = {
      orderId,
      customerEmail,
      // TODO: We don't have a reason for action yet
      reason: '',
    }

    const actions = {
      cancel: cancelOrder,
      approve: approveOrder,
      reject: rejectOrder,
    }

    try {
      const action = actions[type as keyof typeof actions]

      if (!action) {
        throw new Error(`Invalid action type: ${type}`)
      }

      // Execute the action
      await action({ data: data })

      closeDialog()
      pushToast({
        status: 'INFO',
        message: TOASTS_CONFIG[type as keyof typeof TOASTS_CONFIG].success,
        icon: <UIIcon width={30} height={30} name="CircleWavyCheck" />,
      })
    } catch (error) {
      pushToast({
        status: 'ERROR',
        message: TOASTS_CONFIG[type as keyof typeof TOASTS_CONFIG].error,
        icon: <UIIcon width={30} height={30} name="CircleWavyWarning" />,
      })
    }
  }

  return (
    <>
      <div data-fs-order-details-header-actions>
        {allowCancellation && (
          <UIButton
            variant="secondary"
            data-fs-order-details-header-actions-cancel
            size={isMobile || isTablet ? 'regular' : 'small'}
            type="button"
            onClick={() => openDialog('cancel')}
          >
            Cancel order
          </UIButton>
        )}

        {canProcessOrderAuthorization && (
          <>
            {isMobile || isTablet ? (
              <>
                <UIIconButton
                  aria-label="Reject"
                  icon={<UIIcon name="XCircle" />}
                  variant="tertiary"
                  type="button"
                  onClick={() => openDialog('reject')}
                />
                <UIIconButton
                  aria-label="Approve"
                  icon={<UIIcon name="CircleCheck" />}
                  variant="primary"
                  type="button"
                  onClick={() => openDialog('approve')}
                />
              </>
            ) : (
              <>
                <UIButton
                  variant="secondary"
                  size="small"
                  icon={<UIIcon name="XCircle" />}
                  type="button"
                  onClick={() => openDialog('reject')}
                >
                  Reject
                </UIButton>
                <UIButton
                  variant="primary"
                  size="small"
                  icon={<UIIcon name="CircleCheck" />}
                  type="button"
                  onClick={() => openDialog('approve')}
                >
                  Approve
                </UIButton>
              </>
            )}
          </>
        )}
      </div>

      <MyAccountOrderActionModal
        isOpen={isOpen}
        loading={loading}
        fade={fade}
        actionType={actionType}
        onClose={closeDialog}
        onConfirm={handleConfirm}
      />
    </>
  )
}
