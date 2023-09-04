import { Command, Flags } from '@oclif/core'
import { spawn } from 'child_process'
import { existsSync } from 'fs-extra'
import { tmpDir } from '../utils/directory'

export default class GenerateGraphql extends Command {
  static flags = {
    debug: Flags.boolean({ char: 'd' }),
  }

  async run() {
    if (!existsSync(tmpDir)) {
      throw Error(
        'The ".faststore" directory could not be found. When running faststore dev or faststore build, the generate-graphql command is automatically executed.'
      )
    }

    const { flags } = await this.parse(GenerateGraphql)

    return spawn(`yarn generate${flags.debug ? ' --debug' : ''}`, {
      shell: true,
      cwd: tmpDir,
      stdio: 'inherit',
    })
  }
}
