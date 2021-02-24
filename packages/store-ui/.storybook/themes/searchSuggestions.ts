import { createTheme, SxStyleProp } from '../../src'
import searchSuggestionsTheme from '@vtex/gatsby-theme-store/components/SearchSuggestions/theme'

const theme: SxStyleProp = createTheme(searchSuggestionsTheme, {
  suggestions: {
    minWidth: ['19rem', '40rem'],

    position: 'absolute',
    right: [undefined, 0],
  },
})

export default theme
