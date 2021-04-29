import type { SxStyleProp } from 'theme-ui'
import { keyframes } from '@emotion/core'

const toastAnimation = keyframes`
  from {
    transform: translate3d(0, 100%, 0);
  }
  
  to {
    transform: translate3d(0, 0, 0);
  }
`

const defaultContainerTheme: SxStyleProp = {
  alignItems: 'center',
  animation: `${toastAnimation} .125s`,
  animationTimingFunction: 'ease-in-out',
  borderRadius: 5,
  boxShadow: '0 0 10px rgb(0 0 0 / 28%)',
  color: 'white',
  display: 'flex',
  flexDirection: 'row',
  fontSize: '14px',
  justifyContent: 'space-between',
  zIndex: 99999,

  margin: '10px',
  py: '5px',
  px: '10px',

  minHeight: 60,
  width: ['auto'],
  maxWidth: ['none', 420],
  fill: 'white',
}

const containerError: SxStyleProp = {
  ...defaultContainerTheme,
  backgroundColor: '#DC143C',
}

const containerSuccess: SxStyleProp = {
  ...defaultContainerTheme,
  backgroundColor: '#40aa60',
}

const containerWarning: SxStyleProp = {
  ...defaultContainerTheme,
  backgroundColor: '#f3e32d',
}

const theme: SxStyleProp = {
  toast: {
    outerContaienr: {
      overflow: 'hidden',
    },
    container: {
      error: containerError,
      success: containerSuccess,
      warning: containerWarning,
    },
    closeButton: {
      backgroundColor: 'transparent',
      border: 0,
      cursor: 'pointer',
      display: 'flex',
      minWidth: 36,
    },
    icon: {
      display: 'flex',
      minWidth: 36,
      py: '1px',
    },
    content: {},
  },
}

export default theme
