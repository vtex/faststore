import { SxStyleProp } from 'theme-ui'

const theme: SxStyleProp = {
  searchbar: {
    textInput: {
      width: '100%',

      input: {
        pl: 3,
        pr: 48,
        border: 'none',
        width: '100%',
        minHeight: '40px',
        fontSize: 'inherit',
      },

      button: {
        width: '100%',
        padding: 0,
        border: 'none',
        backgroundColor: 'transparent',
      },
    },

    container: {
      maxWidth: 250,
      marginTop: '8px',
      minHeight: '40px',
      bg: 'background',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'gray',
      alignItems: 'center',
      position: 'relative',
    },

    button: {
      backgroundColor: 'transparent',
      color: 'black',
      px: 3,
      position: 'absolute',
      right: 0,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',

      '&:disabled': {
        color: 'gray',
      },
    },
  },
}

export default theme
