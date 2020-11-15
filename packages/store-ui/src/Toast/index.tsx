import React, { FC } from 'react'
import { ToastProps, ToastProvider } from 'react-toast-notifications'
import { Box, Button } from 'theme-ui'

type Props = {
  variant?: string
  onDismiss?: () => void
}

const MyCustomToast: FC<ToastProps & Props> = ({
  appearance,
  children,
  onMouseEnter,
  onMouseLeave,
  onDismiss,
  variant = 'toast',
}) => (
  <Box
    variant={variant}
    className={appearance}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <Box variant={`${variant}.content`}>{children}</Box>
    {onDismiss ? (
      <Button variant={`${variant}.close`} onClick={onDismiss}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
        </svg>
      </Button>
    ) : null}
  </Box>
)

const Toast: FC = ({ children }) => (
  <ToastProvider components={{ Toast: MyCustomToast }}>
    {children}
  </ToastProvider>
)

export default Toast
