import { Command } from '@oclif/core'
import { spawn } from 'child_process'
import { existsSync } from 'fs-extra'
import { tmpDir } from '../utils/directory'

export default class GenerateGraphql extends Command {
  async run() {
    if (!existsSync(tmpDir)) {
      throw Error(
        'The ".faststore" directory could not be found. When running faststore dev or faststore build, the generate-graphql command is automatically executed.'
      )
    }

    return spawn(`yarn generate`, {
      shell: true,
      cwd: tmpDir,
      stdio: 'inherit',
    })
  }
}
