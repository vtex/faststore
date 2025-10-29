export { run } from '@oclif/core'

import { default as Build } from './commands/build'
import { default as CmsSync } from './commands/cms-sync'
import { default as Create } from './commands/create'
import { default as Dev } from './commands/dev'
import { default as LintGraphql } from './commands/lint-graphql'
import { default as Prepare } from './commands/prepare'
import { default as Serve } from './commands/start'
import { default as Test } from './commands/test'

export const commands = {
  create: Create,
  prepare: Prepare,
  dev: Dev,
  build: Build,
  serve: Serve,
  'cms-sync': CmsSync,
  test: Test,
  'lint-graphql': LintGraphql,
}
