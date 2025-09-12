import React from 'react'
import type { ComponentProps } from 'react'

interface Size {
  width: string
  height: string
}

export type BorderStyle = 'regular' | 'pill' | 'circle'

export interface SkeletonProps extends ComponentProps<'div'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
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
   * Custom border radius for skeleton elements.
   */
  borderRadius?: string
}

export default function Skeleton({
  testId = 'fs-skeleton',
  loading = true,
  shimmer = true,
  children,
  size,
  border,
  borderRadius,
  ref,
  ...otherProps
}: SkeletonProps) {
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
      style={borderRadius ? { ...styles, borderRadius: borderRadius } : styles}
      {...otherProps}
    >
      {shimmer && <div data-fs-skeleton-shimmer />}
    </div>
  ) : (
    <>{children}</>
  )
}
