import path from 'node:path'
import { Args, Command } from '@oclif/core'
import chalk from 'chalk'
import { logger } from '../utils/logger'
import genTsTypes from '../utils/generate-types'

export default class Generate extends Command {
  static hidden = true
  static flags = {}

  static args = {
    path: Args.string({
      name: 'path',
      required: true,
      description:
        'The path where the FastStore being built is. Defaults to cwd.',
    }),
  }

  async run() {
    const { args } = await this.parse(Generate)

    await genTsTypes(
      path.isAbsolute(args.path)
        ? args.path
        : path.relative(process.env.PWD ?? process.cwd(), args.path)
    )

    logger.log(
      `${chalk.green(
        'success'
      )} - GraphQL schema, types, and optimizations successfully generated 🎉`
    )
  }
}
