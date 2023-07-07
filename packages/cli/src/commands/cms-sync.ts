import { Command } from '@oclif/core'
import { spawn } from 'child_process'
import { existsSync } from 'fs-extra'
import { tmpDir } from '../utils/directory'
import { generate, mergeCMSFiles } from '../utils/generate'
export default class CmsSync extends Command {
  async run() {
    if (!existsSync(tmpDir)) {
      await generate({ setup: true })
    } else {
      mergeCMSFiles()
    }

    return spawn(`vtex cms sync faststore`, {
      shell: true,
      cwd: tmpDir,
      stdio: 'inherit',
    })
  }
}
