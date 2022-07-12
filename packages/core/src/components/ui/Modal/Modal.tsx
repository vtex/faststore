import type { ModalProps as UIModalProps } from '@faststore/ui'
import { Modal as UIModal } from '@faststore/ui'
import type { ReactNode } from 'react'

import { useUI } from 'src/sdk/ui/Provider'
import { useFadeEffect } from 'src/sdk/ui/useFadeEffect'

import styles from './modal.module.scss'

export type ModalChildrenProps = {
  fade: 'in' | 'out'
  fadeOut: () => void
  fadeIn: () => void
}

type ModalChildrenFunction = (props: ModalChildrenProps) => ReactNode

export type ModalProps = Omit<UIModalProps, 'isOpen' | 'children'> & {
  children: ModalChildrenFunction | ReactNode
}

function Modal({ className, children, ...props }: ModalProps) {
  const { closeModal } = useUI()
  const { fade, fadeOut, fadeIn } = useFadeEffect()

  return (
    <UIModal
      onDismiss={fadeOut}
      onTransitionEnd={() => fade === 'out' && closeModal()}
      data-fs-modal
      data-fs-modal-state={fade}
      className={`${styles.fsModal} ${className}`}
      {...props}
      isOpen
    >
      {typeof children === 'function'
        ? children({ fade, fadeOut, fadeIn })
        : children}
    </UIModal>
  )
}

export default Modal
