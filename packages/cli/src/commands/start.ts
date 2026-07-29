import { Args, Command } from '@oclif/core'
import { spawn, spawnSync } from 'node:child_process'
import fsExtra from 'fs-extra'
import path from 'node:path'
import { resolvePackageManager } from '../utils/commands'
import { getBasePath, withBasePath } from '../utils/directory'

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
    const { getRoot, tmpDir } = withBasePath(basePath)
    const { command, argv } = await resolvePackageManager()

    if (!existsSync(path.join(getRoot(), '.next'))) {
      spawnSync(`${command} faststore build`, {
        shell: true,
        stdio: 'inherit',
      })
    }

    const [bin, ...runnerArgs] = argv

    return spawn(
      bin,
      [...runnerArgs, 'next', 'start', tmpDir, '-p', String(port)],
      {
        stdio: 'inherit',
      }
    )
  }
}
