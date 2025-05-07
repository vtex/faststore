import {
  Button as UIButton,
  Icon as UIIcon,
  IconButton as UIIconButton,
  useUI,
} from '@faststore/ui'
import useScreenResize from 'src/sdk/ui/useScreenResize'
import MyAccountOrderActionModal, {
  useOrderActionModal,
} from 'src/components/account/orders/MyAccountOrderDetails/MyAccountOrderActionModal'
import { useCancelOrder } from 'src/sdk/account/useCancelOrder'

interface MyAccountOrderActionsProps {
  orderId: string
  customerEmail?: string
}

export default function MyAccountOrderActions({
  orderId,
  customerEmail,
}: MyAccountOrderActionsProps) {
  const { isMobile, isTablet } = useScreenResize()
  const { isOpen, actionType, fade, openDialog, closeDialog } =
    useOrderActionModal()
  const { cancelOrder, loading } = useCancelOrder()
  const { pushToast } = useUI()

  const handleConfirm = async (type: string) => {
    if (type === 'cancel') {
      try {
        await cancelOrder({
          data: {
            orderId,
            customerEmail,
            // TODO: We don't have a reason for cancellation yet
            reason: '',
          },
        })

        closeDialog()
      } catch (error) {
        pushToast({
          status: 'ERROR',
          message: error.message,
          icon: <UIIcon width={30} height={30} name="CircleWavyWarning" />,
        })
      }
    }
  }

  return (
    <>
      <div data-fs-order-details-header-actions>
        <UIButton
          variant="secondary"
          data-fs-order-details-header-actions-cancel
          size={isMobile || isTablet ? 'regular' : 'small'}
          type="button"
          onClick={() => openDialog('cancel')}
        >
          Cancel order
        </UIButton>
        {isMobile || isTablet ? (
          <UIIconButton
            aria-label="Reject"
            icon={<UIIcon name="XCircle" />}
            variant="tertiary"
            type="button"
            onClick={() => openDialog('reject')}
          />
        ) : (
          <UIButton
            variant="secondary"
            size="small"
            icon={<UIIcon name="XCircle" />}
            type="button"
            onClick={() => openDialog('reject')}
          >
            Reject
          </UIButton>
        )}
        {isMobile || isTablet ? (
          <UIIconButton
            aria-label="Approve"
            icon={<UIIcon name="CircleCheck" />}
            variant="primary"
            type="button"
            onClick={() => openDialog('approve')}
          />
        ) : (
          <UIButton
            variant="primary"
            size="small"
            icon={<UIIcon name="CircleCheck" />}
            type="button"
            onClick={() => openDialog('approve')}
          >
            Approve
          </UIButton>
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
