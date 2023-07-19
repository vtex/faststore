import { Command } from '@oclif/core'
import { spawn } from 'child_process'
import { tmpDir } from '../utils/directory'
import { generate } from '../utils/generate'
export default class CmsSync extends Command {
  async run() {
    await generate({ setup: true })

    return spawn(`vtex cms sync faststore`, {
      shell: true,
      cwd: tmpDir,
      stdio: 'inherit',
    })
  }
}
