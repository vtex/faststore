import React from 'react'
import { createPortal } from 'react-dom'
import { Box } from 'theme-ui'
import type { ReactNode, FC } from 'react'

import { CrossIcon } from './CrossIcon'

interface Props {
  message: ReactNode
  isVisible: boolean
  hideToast: () => void
}

const Toast: FC<Props> = ({ message, isVisible, hideToast }) => {
  if (!isVisible) {
    return null
  }

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

export default Toast
