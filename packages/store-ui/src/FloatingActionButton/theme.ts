import { SxStyleProp } from 'theme-ui'

const floatingActionButtonTheme: SxStyleProp = {
  floatingActionButton: {
    div: {
      position: 'fixed',
      bottom: '25px',
      right: '25px',
      zIndex: 999,
    },
    a: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '67px',
      height: '67px',
      borderRadius: '50%',
      backgroundColor: '#5ece61',
      boxShadow: '2px 2px 15px #999',
      padding: '1rem',
      '&:hover div': {
        opacity: 1,
        transition: '.5s ease-in-out',
        width: '182px',
      },
      div: {
        position: 'absolute',
        zIndex: -1,
        opacity: 0,
        color: '#fff',
        background: '#5ece61',
        fontSize: '.9rem',
        textAlign: 'center',
        width: '150px',
        height: '67px',
        borderRadius: '500px 0 0 500px',
        right: '35px',
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        span: {
          display: 'block',
          fontSize: '1.2rem',
          fontWeight: '900',
        },
      },
    },
  },
}

export default floatingActionButtonTheme
