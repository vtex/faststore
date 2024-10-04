import { Command } from '@oclif/core'
import { spawn } from 'child_process'
import { existsSync } from 'fs-extra'
import { withBasePath } from '../utils/directory'
import { getPreferredPackageManager } from '../utils/commands'

export default class Start extends Command {
  static args = [
    {
      name: 'account',
      description:
        'The account for which the Discovery is running. Currently noop.',
    },
    {
      name: 'path',
      description:
        'The path where the FastStore being run is. Defaults to cwd.',
    },
    {
      name: 'port',
      description: 'The port where FastStore should run.',
    },
  ]

  async run() {
    const { args } = await this.parse(Start)
    const basePath = args.path ?? process.cwd()
    const port = args.port ?? 3000
    const { tmpDir } = withBasePath(basePath)
    const packageManager = getPreferredPackageManager()

    if (!existsSync(tmpDir)) {
      throw Error(
        'The ".faststore" directory could not be found. If you are trying to serve your store, run "faststore build" first.'
      )
    }

    return spawn(`${packageManager} run serve -p ${port}`, {
      shell: true,
      cwd: tmpDir,
      stdio: 'inherit',
    })
  }
}
