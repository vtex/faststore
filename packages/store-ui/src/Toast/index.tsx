import React from 'react'
import { Box } from 'theme-ui'
import type { ReactNode, FC } from 'react'

import { CrossIcon } from './CrossIcon'
import { ErrorIcon } from './ErrorIcon'
import { WarningIcon } from './WarningIcon'
import { CheckIcon } from './CheckIcon'

type ToastType = 'warning' | 'error' | 'success'

const typeIcons: Record<ToastType, FC> = {
  error: ErrorIcon,
  warning: WarningIcon,
  success: CheckIcon,
}

interface Props {
  message: ReactNode
  isVisible: boolean
  hideToast: () => void
  type?: ToastType
}

const Toast: FC<Props> = ({
  message,
  isVisible,
  hideToast,
  type = 'success',
}) => {
  if (!isVisible) {
    return null
  }

  const Icon = typeIcons[type]

  return (
    <Box variant={`toast.container.${type}`}>
      <Box variant="toast.icon">
        <Icon />
      </Box>
      <Box variant="toast.message">{message}</Box>
      <Box as="button" variant="toast.closeButton" onClick={hideToast}>
        <CrossIcon />
      </Box>
    </Box>
  )
}

export default Toast
