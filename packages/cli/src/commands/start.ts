import { Command } from '@oclif/core'
import { spawn } from 'child_process'
import { userDir } from '../utils/directory'

export default class Start extends Command {
  async run() {
    spawn(`yarn next start`, {
      shell: true,
      cwd: userDir,
      stdio: 'inherit',
    })
  }
}
