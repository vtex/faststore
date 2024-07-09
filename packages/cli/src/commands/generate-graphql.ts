import { Command, Flags } from '@oclif/core'
import { existsSync } from 'fs-extra'
import chalk from 'chalk'

import { withBasePath } from '../utils/directory'
import { runCommandSync } from '../utils/runCommandSync'

export default class GenerateGraphql extends Command {
  static flags = {
    debug: Flags.boolean({ char: 'd' })
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

    const debug = flags.debug ?? false

    if (!existsSync(tmpDir)) {
      console.log(
        `${chalk.red(
          'error'
        )} - The ".faststore" directory could not be found. When running faststore dev or faststore build, the generate-graphql command is automatically executed.`
      )

      process.exit(1)
    }

    runCommandSync({
      cmd: 'yarn generate',
      errorMessage:
        "Failed to run 'yarn generate:schema'. Please check your setup.",
      throws: 'error',
      debug,
      cwd: tmpDir,
    })

    // yarn generate:copy-back expects the DESTINATION var to be present so it can copy the files to the correct directory
    runCommandSync({
      cmd: `DESTINATION=${coreDir} yarn generate:copy-back`,
      errorMessage:
        "Failed to copy back typings files. 'yarn generate:copy-back' thrown errors",
      throws: 'warning',
      debug,
      cwd: tmpDir,
    })

    console.log(
      `${chalk.green(
        'success'
      )} - GraphQL schema, types, and optimizations successfully generated 🎉`
    )
  }
}
