import {
  Modal as UIModal,
  ModalHeader as UIModalHeader,
  ModalBody as UIModalBody,
  ModalFooter as UIModalFooter,
  Button as UIButton,
} from '@faststore/ui'
import useScreenResize from 'src/sdk/ui/useScreenResize'
import BottomSheet from 'src/components/account/components/BottomSheet/BottomSheet'
import styles from './styles.module.scss'

export type OrderActionType = 'cancel' | 'reject' | 'approve'

interface OrderActionConfig {
  title: string
  message: string
  confirmText: string
  cancelText: string
  confirmVariant: 'primary' | 'secondary' | 'tertiary'
}

const ACTION_CONFIGS: Record<OrderActionType, OrderActionConfig> = {
  cancel: {
    title: 'Cancel order',
    message:
      "Are you sure you want to cancel this order? This action can't be undone.",
    confirmText: 'Cancel order',
    cancelText: 'Not now',
    confirmVariant: 'secondary',
  },
  reject: {
    title: 'Reject order',
    message:
      "Are you sure you want to reject this order? This action can't be undone.",
    confirmText: 'Reject',
    cancelText: 'Cancel',
    confirmVariant: 'primary',
  },
  approve: {
    title: 'Approve order',
    message: 'Are you sure you want to approve this order?',
    confirmText: 'Approve',
    cancelText: 'Cancel',
    confirmVariant: 'primary',
  },
}

interface MyAccountOrderActionModalProps {
  isOpen: boolean
  loading?: boolean
  fade?: 'in' | 'out'
  actionType: OrderActionType | null
  onClose: (actionType: OrderActionType) => void
  onConfirm: (actionType: OrderActionType) => void
}

export default function MyAccountOrderActionModal({
  isOpen = false,
  loading = false,
  fade = 'out',
  actionType,
  onClose,
  onConfirm,
}: MyAccountOrderActionModalProps) {
  const { isMobile, isTablet } = useScreenResize()

  const config: OrderActionConfig | null =
    actionType && ACTION_CONFIGS[actionType]
  const dialogContent = (
    <>
      <UIModalHeader
        title={config?.title}
        onClose={() => onClose(actionType)}
      />
      <UIModalBody>
        <p data-fs-order-details-action-modal-message>{config?.message}</p>
      </UIModalBody>
      <UIModalFooter>
        <UIButton variant="tertiary" onClick={() => onClose(actionType)}>
          {config?.cancelText}
        </UIButton>
        <UIButton
          variant={config?.confirmVariant}
          onClick={() => onConfirm(actionType)}
          loading={loading}
        >
          {config?.confirmText}
        </UIButton>
      </UIModalFooter>
    </>
  )

  if (isMobile || isTablet) {
    return (
      <BottomSheet
        data-fs-order-details-action-modal
        isOpen={isOpen}
        onDismiss={() => onClose(actionType)}
        fade={fade}
        overlayProps={{
          className: styles.orderActionsModal,
        }}
      >
        {dialogContent}
      </BottomSheet>
    )
  }

  return (
    <UIModal
      data-fs-order-details-action-modal
      isOpen={isOpen}
      onDismiss={() => onClose(actionType)}
      overlayProps={{
        className: styles.orderActionsModal,
      }}
    >
      {dialogContent}
    </UIModal>
  )
}
