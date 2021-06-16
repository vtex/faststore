import { create } from '@storybook/theming'
import { version } from '../package.json'

export default create({
  base: 'light',
  brandTitle: `Store UI v${version}`,
})
