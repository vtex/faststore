export { run } from '@oclif/core'

import { default as Create } from './commands/create'
import { default as Dev } from './commands/dev'
import { default as Build } from './commands/build'
import { default as Serve } from './commands/start'
import { default as CmsSync } from './commands/cms-sync'
import { default as ContentPlatformSync } from './commands/cp-sync'
import { default as Test } from './commands/test'

export const commands = {
  create: Create,
  dev: Dev,
  build: Build,
  serve: Serve,
  'cms-sync': CmsSync,
  'content-platform-sync': ContentPlatformSync,
  test: Test,
}
