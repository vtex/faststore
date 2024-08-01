'use client'

import React, { useCallback } from 'react'

import type { MouseEvent } from 'react'
import { IconButton, IconButtonProps } from '../../'

export interface AlertCloseButtonProps extends IconButtonProps {
  /**
   * Function called when dismiss button is clicked.
   */
  onClick?: (event: MouseEvent<HTMLElement>) => void
}

function AlertCloseButton({ onClick, ...otherProps }: AlertCloseButtonProps) {
  const handleClose = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (event.defaultPrevented) {
        return
      }

      onClick?.(event)
    },
    [onClick]
  )
  return (
    <IconButton data-fs-alert-button {...otherProps} onClick={handleClose} />
  )
}

export default AlertCloseButton
