import React from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { Box } from 'theme-ui'

import { useToast } from './ToastContext'
import { CrossIcon } from './CrossIcon'

interface Props {
  message?: ReactNode
}

export const Toast = ({ message: propMessage }: Props) => {
  const {
    toastState: { isVisible, message: toastMessage },
    hideToast,
  } = useToast()

  if (!isVisible) return null

  const message = toastMessage ?? propMessage
  const content = (
    <Box variant="toast.container">
      {message}
      <Box as="button" variant="toast.closeButton" onClick={hideToast}>
        <CrossIcon />
      </Box>
    </Box>
  )

  return createPortal(content, document.body)
}
