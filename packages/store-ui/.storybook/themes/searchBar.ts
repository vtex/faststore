import { createTheme, searchBarTheme, ThemeUIStyleObject } from '../../src'

const theme: ThemeUIStyleObject = createTheme(searchBarTheme, {
  searchbar: {
    textInput: {
      maxHeight: '40px',
    },

    container: {
      marginTop: '0px',
      width: '250px',
      height: '45px',
      borderWidth: '1px',
    },

    button: {
      maxHeight: '40px',
    },
  },
})

export default theme
