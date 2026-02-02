import type { StorybookConfig } from '@storybook/nextjs'

import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(
    fileURLToPath(
      import.meta.resolve(join(value, 'package.json'), import.meta.url)
    )
  )
}

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [getAbsolutePath('@chromatic-com/storybook')],
  framework: {
    name: getAbsolutePath('@storybook/nextjs'),
    options: {},
  },
}
export default config
