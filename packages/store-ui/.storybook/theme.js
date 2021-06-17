import { create } from '@storybook/theming/create'
import { version } from '../package.json'

export default create({
  base: 'light',
  brandImage: null,
  brandTitle: `Store UI v${version}`,
  brandUrl: 'https://github.com/vtex/faststore/tree/master/packages/store-ui',
})
