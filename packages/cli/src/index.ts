export { run } from '@oclif/core'

import { default as Build } from './commands/build.ts'
import { default as CmsSync } from './commands/cms-sync.ts'
import { default as Create } from './commands/create.ts'
import { default as Dev } from './commands/dev.ts'
import { default as Generate } from './commands/generate.ts'
import { default as Prepare } from './commands/prepare.ts'
import { default as Serve } from './commands/start.ts'
import { default as Test } from './commands/test.ts'

export const commands = {
  create: Create,
  prepare: Prepare,
  dev: Dev,
  build: Build,
  serve: Serve,
  'cms-sync': CmsSync,
  test: Test,
  generate: Generate,
}
