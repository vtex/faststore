import { Args, Command } from '@oclif/core'
import { spawn } from 'child_process'
import { existsSync } from 'fs-extra'
import { getPreferredPackageManager } from '../utils/commands'
import { getBasePath, withBasePath } from '../utils/directory'

export default class Start extends Command {
  static args = {
    account: Args.string({
      description:
        'The account for which the Discovery is running. Currently noop.',
    }),
    path: Args.string({
      description:
        'The path where the FastStore being run is. Defaults to cwd.',
    }),
    port: Args.string({
      description: 'The port where FastStore should run. Defaults to 3000.',
    }),
  }

  async run() {
    const { args } = await this.parse(Start)
    const basePath = getBasePath(args.path)
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
