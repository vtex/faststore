import { addons } from '@storybook/addons'
import customTheme from './theme'

addons.setConfig({
  toolbar: {
    zoom: { hidden: true },
  },
  theme: customTheme,
})
