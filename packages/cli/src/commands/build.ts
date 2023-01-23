import { Command } from '@oclif/core'
import chalk from 'chalk'
import { spawnSync } from 'child_process'
import { existsSync } from 'fs'
import { copy, removeSync } from 'fs-extra'
import { tmpDir, userDir } from '../utils/directory'
import { generate } from '../utils/generate'

export default class Build extends Command {
  async run() {
    await generate({ setup: true })

    spawnSync(`yarn build`, {
      shell: true,
      cwd: tmpDir,
      stdio: 'inherit',
    })
    await copyFolder(`${tmpDir}/.next`, `${userDir}/.next`)
    await copyFolder(`${tmpDir}/public`, `${userDir}/public`)
  }
}

async function copyFolder(from: string, to: string) {
  try {
    if (existsSync(to)) {
      removeSync(to)
    }

    await copy(from, to)
    console.log(
      `${chalk.green('success')} - Folder ${chalk.dim(
        from
      )} copied to ${chalk.dim(to)}`
    )
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  }
}
