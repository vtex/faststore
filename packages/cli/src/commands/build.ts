import { Command } from '@oclif/core'
import { spawnSync } from 'child_process'
import { tmpDir } from '../utils/directory'
import { generate } from '../utils/generate'

export default class Build extends Command {
  async run() {
    await generate({ setup: true })

    return spawnSync(`yarn build`, {
     shell: true,
     cwd: tmpDir,
     stdio: 'inherit',
   })
  }
}
