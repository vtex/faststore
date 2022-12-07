import React, { forwardRef } from 'react'

import { Button } from '@faststore/components'
import type { ButtonProps } from '@faststore/components'
import Spinner from '../../atoms/Spinner'

export interface LoadingButtonProps extends ButtonProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * The current loading state of the button.
   */
  loading: boolean
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  function LoadingButton(
    { children, loading, testId = 'store-loading-button', ...otherProps },
    ref
  ) {
    return (
      <Button ref={ref} data-fs-loading-button testId={testId} {...otherProps}>
        {loading ? <Spinner /> : children}
      </Button>
    )
  }
)

export default LoadingButton
