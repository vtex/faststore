import React, { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import ProgressBar from '../../atoms/ProgressBar'

export interface ProgressStatusProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The progress status value.
   */
  progressValue: number
  /**
   * The left side element. Most of time it's gonna be a label
   */
  leftSideElement?: string | ReactNode
  /**
   * The left side element. Most of time it's gonna be a label
   */
  rightSideElement?: string | ReactNode
  /**
   * Optional test ID for testing.
   */
  testId?: string
}

export const ProgressStatus = forwardRef<HTMLDivElement, ProgressStatusProps>(
  function ProgressStatus(
    {
      progressValue,
      leftSideElement,
      rightSideElement,
      testId = 'fs-progress-status',
      ...props
    },
    ref
  ) {
    return (
      <div ref={ref} data-fs-progress-status data-testid={testId} {...props}>
        {leftSideElement && <p>{leftSideElement}</p>}
        <ProgressBar value={progressValue} />
        {rightSideElement && <p>{rightSideElement}</p>}
      </div>
    )
  }
)

export default ProgressStatus
