import { SxStyleProp } from 'theme-ui'

const floatingActionButtonTheme: SxStyleProp = {
  floatingActionButton: {
    position: 'fixed',
    bottom: '25px',
    right: '25px',
    zIndex: 999,
    a: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '67px',
      height: '67px',
      borderRadius: '50%',
      backgroundColor: 'primary',
      boxShadow: '2px 2px 15px #999',
      padding: '1rem',
    },
  },
}

export default floatingActionButtonTheme
