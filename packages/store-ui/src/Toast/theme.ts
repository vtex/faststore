import type { SxStyleProp } from 'theme-ui'

const theme: SxStyleProp = {
  toast: {
    container: {
      alignItems: 'center',
      background: '#40aa60',
      borderRadius: 5,
      boxShadow: '0 0 10px rgb(0 0 0 / 28%)',
      color: 'white',
      display: 'flex',
      flexDirection: 'row',
      fontSize: '14px',
      justifyContent: 'space-between',
      zIndex: 998,

      bottom: 30,
      position: 'sticky',

      marginLeft: ['10px', 'auto'],
      marginRight: ['10px', '5%'],
      py: '5px',
      paddingRight: 20,
      paddingLeft: 20,

      minHeight: 60,
      width: ['auto', '100%'],
      maxWidth: ['none', 420],
    },
    closeButton: {
      backgroundColor: 'transparent',
      border: 0,
      cursor: 'pointer',
      display: 'flex',
      minWidth: '36px',
    },
  },
}

export default theme
