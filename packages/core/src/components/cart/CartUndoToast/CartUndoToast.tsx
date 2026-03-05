import { useEffect, useState } from 'react'
import { Button as UIButton } from '@faststore/ui'

import styles from './CartUndoToast.module.scss'

function TrashIcon({ width = 20, height = 20 }: { width?: number; height?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 256 256"
      fill="currentColor"
    >
      <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
    </svg>
  )
}

function CloseIcon({ width = 16, height = 16 }: { width?: number; height?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 256 256"
      fill="currentColor"
    >
      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
    </svg>
  )
}

interface CartUndoToastProps {
  itemName: string
  onUndo: () => void
  onDismiss: () => void
}

function CartUndoToast({ itemName, onUndo, onDismiss }: CartUndoToastProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(onDismiss, 300)
    }, 7700)

    return () => clearTimeout(timer)
  }, [onDismiss])

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(onDismiss, 300)
  }

  return (
    <div
      className={`${styles.cartUndoToast} ${
        isExiting ? styles['cartUndoToast--exiting'] : ''
      }`}
      role="status"
      aria-live="polite"
    >
      <div className={styles.cartUndoToast__content}>
        <TrashIcon />
        <span className={styles.cartUndoToast__message}>
          <strong>{itemName}</strong> removed from cart
        </span>
      </div>
      <div className={styles.cartUndoToast__actions}>
        <UIButton
          variant="tertiary"
          size="small"
          onClick={onUndo}
        >
          Undo
        </UIButton>
        <button
          className={styles.cartUndoToast__closeBtn}
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  )
}

export default CartUndoToast
