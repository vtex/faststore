import { Command } from '@oclif/core'
import { spawnSync } from 'child_process'
import { copy } from 'fs-extra'
import { tmpDir, userDir } from '../utils/directory'
import { generate } from '../utils/generate'
export default class Build extends Command {
  async run() {
    await generate({ setup: true })
    spawnSync(`yarn next build`, {
      shell: true,
      cwd: tmpDir,
      stdio: 'inherit',
    })
    await copy(`${tmpDir}/.next`, `${userDir}/.next`)
  }
}
