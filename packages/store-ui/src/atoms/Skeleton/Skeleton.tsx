/** @jsxRuntime classic */
/** @jsx jsx */
import { forwardRef } from 'react'
import type { HtmlHTMLAttributes } from 'react'
import { jsx, css, keyframes } from '@emotion/core'

export interface SkeletonProps extends HtmlHTMLAttributes<HTMLDivElement> {
  /**
   * Skeleton's width
   */
  width?: string
  /**
   * Skeleton's height
   */
  height?: string
  /**
   * Background, or primary, color
   */
  backgroundColor?: string
  /**
   * Highlight color, the one that will look like it's moving
   */
  highlightColor?: string
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  {
    width = '100%',
    height = '50px',
    backgroundColor = '#ddd',
    highlightColor = '#eee',
    testId = 'store-skeleton',
  },
  ref
) {
  return (
    <div
      ref={ref}
      data-store-skeleton
      data-testid={testId}
      css={css`
      background-color: ${highlightColor}
      border-radius: 4px;
      display: block;
      line-height: 1;
      width: ${width};
      height: ${height};
      position: relative;
      overflow: hidden;
      margin-top: 4px;
    `}
    >
      <div
        css={css`
          width: 300vw;
          height: 100%;
          position: relative;
          left: 0;
          background-color: ${backgroundColor};
          background-image: linear-gradient(
            90deg,
            ${backgroundColor},
            ${backgroundColor} 30%,
            ${highlightColor} 60%,
            ${backgroundColor} 70%,
            ${backgroundColor}
          );
          background-size: 50% 100%;
          background-repeat: repeat-x;
          animation: ${keyframes`
            0% {
              /* Animating absolute units, such as vw, has
              better performance than relative units, such as %,
              because it needs to be recalculated every frame */
              transform: translate3d(-150vw, 0, 0);
            }
            100% {
              transform: translate3d(0, 0, 0);
            }
          `} 800ms infinite linear;
        `}
      />
    </div>
  )
})

export default Skeleton
