import { Command } from '@oclif/core'
import { spawnSync } from 'child_process'
import { copy } from 'fs-extra'
import { tmpDir, userDir } from '../utils/directory'
import { generate } from '../utils/generate'

async function copyDir(dirName: string) {
  await copy(`${tmpDir}/${dirName}`, `${userDir}/${dirName}`)
}

export default class Build extends Command {
  async run() {
    await generate({ setup: true })
    spawnSync(`yarn next build`, {
      shell: true,
      cwd: tmpDir,
      stdio: 'inherit',
    })
    await copyDir('.next')
    await copyDir('public')
  }
}
