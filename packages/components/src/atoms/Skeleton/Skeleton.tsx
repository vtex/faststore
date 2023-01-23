import React, { forwardRef } from 'react'
import type { HTMLAttributes, PropsWithChildren } from 'react'

interface Size {
  width: string
  height: string
}

export type BorderStyle = 'regular' | 'pill' | 'circle'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Control whether skeleton should be visible or not.
   */
  loading?: boolean
  /**
   * Control whether the shimmer effect should be displayed or not.
   */
  shimmer?: boolean
  /**
   * Specifies the skeleton element size (width, height).
   */
  size: Size
  /**
   * Specifies the skeleton element border radius ('regular' | 'pill' | 'circle').
   */
  border?: BorderStyle
  /**
   * Customizes the skeleton element border size.
   */
  customBorder?: string
}

const Skeleton = forwardRef<HTMLDivElement, PropsWithChildren<SkeletonProps>>(
  function Skeleton(
    {
      testId = 'fs-skeleton',
      loading = true,
      shimmer = false,
      children,
      size,
      border,
      customBorder,
      ...otherProps
    },
    ref
  ) {
    const styles = {
      width: size.width,
      height: size.height,
    }

    return loading ? (
      <div
        ref={ref}
        data-fs-skeleton
        data-testid={testId}
        data-fs-skeleton-border={border ? border : null}
        style={
          customBorder ? { ...styles, borderRadius: customBorder } : styles
        }
        {...otherProps}
      >
        {shimmer && <div data-fs-skeleton-shimmer />}
      </div>
    ) : (
      <>{children}</>
    )
  }
)

export default Skeleton
