import '!style-loader!css-loader!sass-loader!../src/styles/fonts.css'
import '!style-loader!css-loader!sass-loader!../src/styles/global/layout.scss'
import '!style-loader!css-loader!sass-loader!../src/styles/global/resets.scss'
import '!style-loader!css-loader!sass-loader!../src/styles/global/storybook-components.scss'
import '!style-loader!css-loader!sass-loader!../src/styles/global/tokens.scss'
import '!style-loader!css-loader!sass-loader!../src/styles/global/typography.scss'
import SBTheme from './theme'

// Viewports from src/styles/vendors/include-media_overwrite.scss
const customViewports = {
  phone: {
    name: 'Phone',
    styles: {
      width: '320px',
      height: '480px',
    },
  },
  phonemid: {
    name: 'PhoneMid',
    styles: {
      width: '375px',
      height: '667px',
    },
  },
  tablet: {
    name: 'Tablet',
    styles: {
      width: '768px',
      height: '1024px',
    },
  },
  notebook: {
    name: 'Notebook',
    styles: {
      width: '1280px',
      height: '960px',
    },
  },
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1440px',
      height: '1024px',
    },
  },
}

export const parameters = {
  actions: { disable: true, argTypesRegex: '^on[A-Z].*' },
  controls: {
    theme: SBTheme,
  },
  docs: {
    theme: SBTheme,
  },
  viewMode: 'docs',
  previewTabs: {
    'storybook/docs/panel': {},
    canvas: { title: 'Sandbox' },
  },
  viewport: {
    viewports: customViewports,
  },
  options: {
    showToolbar: true,
    storySort: {
      method: 'alphabetical',
      order: [
        'Getting Started',
        'Theming',
        'Fundamentals',
        ['Colors', 'Typography', 'Icons'],
        'Atoms',
        'Molecules',
        'Organisms',
        'Releases',
      ],
    },
  },
}
