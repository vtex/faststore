import { Args, Command } from '@oclif/core'
import { spawn, spawnSync } from 'child_process'
import fsExtra from 'fs-extra'
import { getPreferredPackageManager } from '../utils/commands'
import { getBasePath, withBasePath } from '../utils/directory'
import path from 'path'

const { existsSync } = fsExtra

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
    const { getRoot } = withBasePath(basePath)
    const packageManager = getPreferredPackageManager()

    if (!existsSync(path.join(getRoot(), '.next'))) {
      spawnSync(`${packageManager} faststore build`, {
        shell: true,
        stdio: 'inherit',
      })
    }

    return spawn(`${packageManager} next start -p ${port}`, {
      shell: true,
      stdio: 'inherit',
    })
  }
}
