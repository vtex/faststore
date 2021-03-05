/** @jsx jsx */
import { jsx, css, keyframes } from '@emotion/core'
import { Box } from 'theme-ui'

const radius = 40
const circ = 2 * radius * Math.PI

/** This spinner was made because theme-ui's is under-performant.
 * Theirs triggers layout and style events that cause excessive
 * CPU usage, whereas this one only uses GPU for animation.
 * Be very careful when changing it so the purpose is not defeated.
 */
const Spinner = ({
  width,
  height,
  size = 40,
  color,
  ...props
}: {
  width?: number
  height?: number
  size?: number
  color?: string
} & any) => (
  <Box
    // I'm just doing here what theme-ui does for its own spinner wtih __css
    // ಠ_ಠ these rules are overly strict, I have to do both of these:
    // eslint-disable-next-line
    // @ts-ignore
    __css={{ color: 'primary' }}
    {...props}
  >
    <svg
      css={css`
        animation: ${keyframes`
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
      `} 500ms infinite linear;
      `}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      width={size ?? width}
      height={size ?? height}
    >
      <circle
        className="vtex-spinner_circle"
        cx="50"
        cy="50"
        fill="none"
        r={radius}
        stroke={color ?? 'currentColor'}
        strokeWidth="10"
        strokeDasharray={`0 0 ${circ * 0.65} ${circ}`}
        strokeLinecap="round"
        strokeDashoffset="1"
      />
    </svg>
  </Box>
)

export default Spinner
