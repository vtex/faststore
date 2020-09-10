import { SxStyleProp } from 'theme-ui'

export const searchBarTheme: SxStyleProp = {
  searchbar: {
    input: {
      border: 'none',
      px: 3,
    },

    container: {
      maxWidth: 250,
      bg: 'background',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'gray',
      alignItems: 'center',
    },

    button: {
      backgroundColor: 'transparent',
      color: 'black',
      px: 3,
      '&:disabled': {
        color: 'gray',
      },
    },
  },
}
