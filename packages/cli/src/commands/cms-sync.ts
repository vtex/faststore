import { Command } from '@oclif/core'
import { spawn } from 'child_process'
import { existsSync } from 'fs-extra'
import { tmpDir } from '../utils/directory'

export default class CmsSync extends Command {
  async run() {
    if (!existsSync(tmpDir)) {
      throw Error(
        'The ".faststore" directory could not be found. If you are trying to serve your store, run "faststore build" first.'
      )
    }

    return spawn(`vtex cms sync faststore`, {
      shell: true,
      cwd: tmpDir,
      stdio: 'inherit',
    })
  }
}
