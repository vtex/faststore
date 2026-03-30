import { Args, Command } from '@oclif/core'
import chalk from 'chalk'
import { getBasePath, withBasePath } from '../utils/directory'
import { generate } from '../utils/generate'
import { logger } from '../utils/logger'
import genTsTypes from '../utils/generate-types'

export default class Generate extends Command {
  static flags = {}

  static args = {
    path: Args.string({
      name: 'path',
      hidden: true,
      description:
        'The path where the FastStore being built is. Defaults to cwd.',
    }),
  }

  async run() {
    const { args } = await this.parse(Generate)
    const basePath = getBasePath(args.path)
    const { tmpDir } = withBasePath(basePath)

    await generate({ setup: true, basePath })

    genTsTypes(args.path ?? tmpDir)

    logger.log(
      `${chalk.green(
        'success'
      )} - GraphQL schema, types, and optimizations successfully generated 🎉`
    )
  }
}
