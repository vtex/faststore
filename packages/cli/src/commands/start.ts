import { Command } from '@oclif/core'
import { spawn } from 'child_process'
import { existsSync } from 'fs-extra'
import { withBasePath } from '../utils/directory'

export default class Start extends Command {
  static args = [
    {
      name: 'path',
      description: 'The path where the FastStore being run is. Defaults to cwd.',
    }
  ]

  async run() {
    const { args } = await this.parse(Start)
    const basePath = args.path ?? process.cwd()
    const { tmpDir } = withBasePath(basePath)

    if (!existsSync(tmpDir)) {
      throw Error(
        'The ".faststore" directory could not be found. If you are trying to serve your store, run "faststore build" first.'
      )
    }

    return spawn(`yarn serve`, {
      shell: true,
      cwd: tmpDir,
      stdio: 'inherit',
    })
  }
}
