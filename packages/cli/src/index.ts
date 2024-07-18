export { run } from '@oclif/core'

import { default as Init } from './commands/init'
import { default as Dev } from './commands/dev'
import { default as Build } from './commands/build'
import { default as Serve } from './commands/start'
import { default as CmsSync } from './commands/cms-sync'
import { default as Test } from './commands/test'

export const commands = {
  init: Init,
  dev: Dev,
  build: Build,
  serve: Serve,
  'cms-sync': CmsSync,
  test: Test,
}
