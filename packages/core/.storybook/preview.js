import '!style-loader!css-loader!sass-loader!../src/styles/fonts.css'
import '!style-loader!css-loader!sass-loader!../src/styles/global/tokens.scss'
import '!style-loader!css-loader!sass-loader!../src/styles/global/resets.scss'
import '!style-loader!css-loader!sass-loader!../src/styles/global/typography.scss'
import '!style-loader!css-loader!sass-loader!../src/styles/global/layout.scss'
import '!style-loader!css-loader!sass-loader!../src/styles/global/storybook-components.scss'

import SBTheme from './theme'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    theme: SBTheme,
  },
  docs: {
    theme: SBTheme,
  },
  options: {
    storySort: {
      order: ['Releases', 'Atoms', 'Molecules', 'Organisms'],
    },
  },
}
