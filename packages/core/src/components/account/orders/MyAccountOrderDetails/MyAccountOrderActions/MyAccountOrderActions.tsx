import {
  Button as UIButton,
  Icon as UIIcon,
  IconButton as UIIconButton,
} from '@faststore/ui'
import useScreenResize from 'src/sdk/ui/useScreenResize'
import MyAccountOrderActionModal, {
  useOrderActionModal,
} from 'src/components/account/orders/MyAccountOrderDetails/MyAccountOrderActionModal'

export default function MyAccountOrderActions() {
  const { isMobile, isTablet } = useScreenResize()
  const { isOpen, actionType, fade, openDialog, closeDialog } =
    useOrderActionModal()

  const handleConfirm = () => {
    // TODO: Implement the actual action handling
    closeDialog()
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
        fade={fade}
        actionType={actionType}
        onClose={closeDialog}
        onConfirm={handleConfirm}
      />
    </>
  )
}
