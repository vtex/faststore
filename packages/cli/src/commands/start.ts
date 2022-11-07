import { Command } from '@oclif/core'
import { spawn } from 'child_process'
import fse from 'fs-extra'
import { tmpDir } from '../utils/directory'

export default class Start extends Command {
  async run() {
    if (!fse.existsSync(tmpDir)) {
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
