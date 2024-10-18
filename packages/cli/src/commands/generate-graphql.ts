import chalk from 'chalk'
import { Command, Flags } from '@oclif/core'
import { existsSync } from 'fs-extra'

import { withBasePath } from '../utils/directory'
import { runCommandSync } from '../utils/runCommandSync'
import { getPreferredPackageManager } from '../utils/commands'
import { logger } from '../utils/logger';

export default class GenerateGraphql extends Command {
  static flags = {
    core: Flags.boolean({ char: 'c', hidden: true }),
  }

  static args = [
    {
      name: 'path',
      description: 'The path where the FastStore GraphQL customization is. Defaults to cwd.',
    }
  ]

  async run() {
    const { flags, args } = await this.parse(GenerateGraphql)

    const basePath = args.path ?? process.cwd()
    const { tmpDir, coreDir } = withBasePath(basePath)

    const isCore = flags.core ?? false

    const packageManager = getPreferredPackageManager()

    if (!isCore && !existsSync(tmpDir)) {
      logger.log(
        `${chalk.red(
          'error'
        )} - The ".faststore" directory could not be found. When running faststore dev or faststore build, the generate-graphql command is automatically executed.`
      )

      process.exit(1)
    }

    runCommandSync({
      cmd: `${packageManager} run generate:schema`,
      errorMessage: `Failed to run '${packageManager} generate:schema'. Please check your setup.`,
      throws: 'error',
      cwd: isCore ? undefined : tmpDir,
    })

    runCommandSync({
      cmd: `${packageManager} run generate:codegen`,
      errorMessage:
        'GraphQL was not optimized and TS files were not updated. Changes in the GraphQL layer did not take effect',
      throws: 'error',
      cwd: isCore ? undefined : tmpDir,
    })

    runCommandSync({
      cmd: `${packageManager} run format:generated`,
      errorMessage:
        `Failed to format generated files. '${packageManager} format:generated' thrown errors`,
      throws: 'warning',
      cwd: isCore ? undefined : tmpDir,
    })

    // The command generate:copy-back expects the DESTINATION var to be present so it can copy the files to the correct directory
    runCommandSync({
      cmd: `DESTINATION=${coreDir} ${packageManager} run generate:copy-back`,
      errorMessage:
        `Failed to copy back typings files. '${packageManager} generate:copy-back' thrown errors`,
      throws: 'warning',
      cwd: isCore ? undefined : tmpDir,
    })

    logger.log(
      `${chalk.green(
        'success'
      )} - GraphQL schema, types, and optimizations successfully generated 🎉`
    )
  }
}
