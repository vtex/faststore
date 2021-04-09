import type { SxStyleProp } from 'theme-ui'

const defaultContainerTheme: SxStyleProp = {
  alignItems: 'center',
  borderRadius: 5,
  boxShadow: '0 0 10px rgb(0 0 0 / 28%)',
  color: 'white',
  display: 'flex',
  flexDirection: 'row',
  fontSize: '14px',
  justifyContent: 'space-between',
  zIndex: 99999,

  bottom: 30,
  position: 'sticky',

  marginLeft: ['10px', 'auto'],
  marginRight: ['10px', '5%'],
  py: '5px',
  px: '10px',

  minHeight: 60,
  width: ['auto', '100%'],
  maxWidth: ['none', 420],
  fill: 'white',
}

const theme: SxStyleProp = {
  toast: {
    container: {
      error: {
        ...defaultContainerTheme,
        background: '#DC143C',
      },
      success: {
        ...defaultContainerTheme,
        background: '#40aa60',
      },
      warning: {
        ...defaultContainerTheme,
        background: '#f3e32d',
      },
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
    message: {},
  },
}

export default theme
