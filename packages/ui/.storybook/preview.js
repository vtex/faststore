import '../src/styles/global.scss'

// Viewports from src/styles/utilities.scss
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
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    viewports: customViewports,
  },
}
