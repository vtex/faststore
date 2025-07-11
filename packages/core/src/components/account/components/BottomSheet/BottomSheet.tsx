import type { ReactNode } from 'react'
import {
  Modal as UIModal,
  type ModalProps,
  type OverlayProps,
} from '@faststore/ui'

export interface BottomSheetProps extends Omit<ModalProps, 'title'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
  /**
   * A boolean value that represents the state of the BottomSheet
   */
  isOpen?: boolean
  /**
   * Represents the fade effect of the BottomSheet.
   */
  fade?: 'in' | 'out'
  /**
   * Props forwarded to the `Overlay` component.
   */
  overlayProps?: OverlayProps
  /**
   * This function is called whenever the user clicks outside
   * the modal content
   */
  onDismiss?: () => void
  children: ReactNode
}

function BottomSheet({
  testId = 'fs-bottom-sheet',
  isOpen,
  fade = 'out',
  children,
  overlayProps,
  onDismiss,
  ...otherProps
}: BottomSheetProps) {
  return (
    <UIModal
      data-fs-modal={null}
      data-fs-bottom-sheet
      data-fs-bottom-sheet-state={fade}
      isOpen={isOpen}
      onDismiss={onDismiss}
      testId={testId}
      overlayProps={overlayProps}
      {...otherProps}
    >
      {children}
    </UIModal>
  )
}

export default BottomSheet
