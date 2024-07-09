import { Command } from '@oclif/core'
import { spawn } from 'child_process'
import { existsSync } from 'fs-extra'
import { withBasePath } from '../utils/directory'
import { getPreferredPackageManager } from '../utils/commands'

export default class Start extends Command {
  async run() {
    const basePath = process.cwd()
    const { tmpDir } = withBasePath(basePath)
    const packageManager = getPreferredPackageManager()

    if (!existsSync(tmpDir)) {
      throw Error(
        'The ".faststore" directory could not be found. If you are trying to serve your store, run "faststore build" first.'
      )
    }

    return spawn(`${packageManager} run serve`, {
      shell: true,
      cwd: tmpDir,
      stdio: 'inherit',
    })
  }
}
