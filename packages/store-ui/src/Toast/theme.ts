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

  marginLeft: ['10px', 'auto'],
  marginRight: ['10px', '5%'],
  py: '5px',
  px: '10px',

  minHeight: 60,
  width: ['auto', '100%'],
  maxWidth: ['none', 420],
  fill: 'white',
}

const containerPortal: SxStyleProp = {
  bottom: 30,
  position: 'sticky',
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
    container: {
      error: {
        ...containerError,
        portal: {
          ...containerError,
          ...containerPortal,
        },
      },
      success: {
        ...containerSuccess,
        portal: {
          ...containerSuccess,
          ...containerPortal,
        },
      },
      warning: {
        ...containerWarning,
        portal: {
          ...containerWarning,
          ...containerPortal,
        },
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
