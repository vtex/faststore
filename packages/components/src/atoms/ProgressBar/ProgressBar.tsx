import React, { forwardRef, useMemo } from 'react'
import type { HTMLAttributes } from 'react'

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /* Current value of the progress */
  value?: number
  /* Minimum value (default 0) */
  min?: number
  /* Maximum value (default 100) */
  max?: number
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  function ProgressBar(
    {
      value = 0,
      min = 0,
      max = 100,
      testId = 'fs-progress-bar',
      ...otherProps
    },
    ref
  ) {
    const clampedValue = useMemo(() => {
      const safeMax = Math.max(min, max)
      return Math.min(Math.max(value, min), safeMax)
    }, [value, min, max])

    const fillPercent = ((clampedValue - min) / (max - min)) * 100

    return (
      <div ref={ref} data-fs-progress-bar data-testid={testId} {...otherProps}>
        <div data-fs-progress-bar-track>
          <div data-fs-progress-bar-fill style={{ width: `${fillPercent}%` }} />
        </div>
      </div>
    )
  }
)
export default ProgressBar
