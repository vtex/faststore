import { SxStyleProp } from 'theme-ui'

export const floatingActionButtonTheme: SxStyleProp = {
  floatingActionButton: {
    a: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      width: '67px',
      height: '67px',
      bottom: '25px',
      right: '25px',
      zIndex: 999,
      backgroundColor: '#5ece61',
      borderRadius: '500px',
      boxShadow: '2px 2px 15px #999',
      '&:hover span': {
        opacity: 1,
        display: 'block',
        zIndex: '-1',
        transition: '.5s ease-in-out',
        width: '182px',
        height: '67px',
        position: 'absolute',
      },
    },
    span: {
      opacity: 0,
      color: '#fff',
      background: '#5ece61',
      fontSize: '.9rem',
      textAlign: 'center',
      width: '150px',
      borderRadius: '500px 0 0 500px',
      right: '35px',
    },
  },
}

export default floatingActionButtonTheme
