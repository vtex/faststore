import {
  Modal as UIModal,
  ModalHeader as UIModalHeader,
  ModalBody as UIModalBody,
  ModalFooter as UIModalFooter,
  Button as UIButton,
  type ButtonProps,
  useFadeEffect,
} from '@faststore/ui'
import styles from './styles.module.scss'

interface MyAccountOrderActionModalProps {
  isOpen: boolean
  loading?: boolean
  title: string
  message: React.ReactNode
  confirmText: string
  cancelText?: string
  confirmVariant?: ButtonProps['variant']
  danger?: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function MyAccountOrderActionModal({
  isOpen = false,
  loading = false,
  title,
  message,
  confirmText,
  cancelText = 'Not now',
  confirmVariant = 'primary',
  danger = false,
  onClose,
  onConfirm,
}: MyAccountOrderActionModalProps) {
  const { fade, fadeOut, fadeIn } = useFadeEffect()

  return (
    <UIModal
      data-fs-order-details-action-modal
      isOpen={isOpen}
      onDismiss={fadeOut}
      onTransitionEnd={() => {
        if (fade === 'out') {
          onClose()
          fadeIn()
        }
      }}
      overlayProps={{
        className: styles.orderActionsModal,
      }}
      data-fs-modal-state={fade}
    >
      <UIModalHeader title={title} onClose={fadeOut} />
      <UIModalBody>
        <p data-fs-order-details-action-modal-message>{message}</p>
      </UIModalBody>
      <UIModalFooter>
        <UIButton variant="secondary" onClick={fadeOut} disabled={loading}>
          {cancelText}
        </UIButton>
        <UIButton
          variant={confirmVariant}
          onClick={onConfirm}
          loading={loading}
          data-fs-button-danger={danger}
        >
          {confirmText}
        </UIButton>
      </UIModalFooter>
    </UIModal>
  )
}
