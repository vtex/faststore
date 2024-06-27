export { run } from '@oclif/core'

import { default as Dev } from './commands/dev'
import { default as Build } from './commands/build'
import { default as Init } from './commands/init'
import { default as Serve } from './commands/start'
import { default as CmsSync } from './commands/cms-sync'
import { default as GenerateGraphql } from './commands/generate-graphql'
import { default as Test } from './commands/test'

export const commands = {
  dev: Dev,
  build: Build,
  init: Init,
  serve: Serve,
  'cms-sync': CmsSync,
  'generate-graphql': GenerateGraphql,
  test: Test,
}
