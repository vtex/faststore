import React, { forwardRef, useMemo } from 'react'
import type { HTMLAttributes } from 'react'

export interface BarChartProps extends HTMLAttributes<HTMLDivElement> {
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

const BarChart = forwardRef<HTMLDivElement, BarChartProps>(function BarChart(
  { value = 0, min = 0, max = 100, testId = 'fs-bar-chart', ...otherProps },
  ref
) {
  const fillPercent = useMemo(() => {
    const safeMax = Math.max(min, max)
    const safeMin = Math.min(min, max)

    if (safeMax === safeMin) {
      return 0
    }

    const clampedValue = Math.min(Math.max(value, safeMin), safeMax)
    return ((clampedValue - safeMin) / (safeMax - safeMin)) * 100
  }, [value, min, max])

  return (
    <div ref={ref} data-fs-bar-chart data-testid={testId} {...otherProps}>
      <div data-fs-bar-chart-track>
        <div data-fs-bar-chart-fill style={{ width: `${fillPercent}%` }} />
      </div>
    </div>
  )
})
export default BarChart
