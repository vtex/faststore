/** @jsx jsx */
import { jsx, css, keyframes } from '@emotion/core'
import type { FunctionComponent } from 'react'

const PRIMARY_COLOR = '#eee'
const SECONDARY_COLOR = '#ddd'

interface Props {
  width?: string
  height?: string
}

const Skeleton: FunctionComponent<Props> = ({
  width = '100%',
  height = '50px',
}) => (
  <div
    css={css`
      background-color: ${PRIMARY_COLOR}
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
        background-color: ${SECONDARY_COLOR};
        background-image: linear-gradient(
          90deg,
          ${SECONDARY_COLOR},
          ${SECONDARY_COLOR} 30%,
          ${PRIMARY_COLOR} 60%,
          ${SECONDARY_COLOR} 70%,
          ${SECONDARY_COLOR}
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

export default Skeleton
