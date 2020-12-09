/** @jsx jsx */
import { jsx, css, keyframes } from '@emotion/core'
import type { FC } from 'react'

const baseColor = '#eee'

interface Props {
  width?: string
  height?: string
}

const Skeleton: FC<Props> = ({ width = '100%', height = '50px' }) => (
  <div
    css={css`
      background-color: ${baseColor};
      border-radius: 4px;
      display: block;
      line-height: 1;
      width: ${width};
      height: ${height};
      position: relative;
      overflow: hidden;
      margin-top: 4px;

      ::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to left, #eee, #ddd, #eee);
        animation: ${keyframes`
    0% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(calc(${width} - 100px));
    }
    0% {
      transform: translateX(0);
    }
  `} 1.2s infinite;
      }
    `}
  />
)

export default Skeleton
