import { Command } from '@oclif/core'
import chalk from 'chalk'
import { spawnSync } from 'child_process'
import { existsSync } from 'fs'
import { copySync, removeSync, moveSync } from 'fs-extra'
import { tmpDir, userDir } from '../utils/directory'
import { generate } from '../utils/generate'

export default class Build extends Command {
  async run() {
    await generate({ setup: true })

    const yarnBuildResult = spawnSync(`yarn build`, {
      shell: true,
      cwd: tmpDir,
      stdio: 'inherit',
    })

    if (yarnBuildResult.status && yarnBuildResult.status !== 0) {
      process.exit(yarnBuildResult.status)
    }

    await finish()
  }
}

async function copyResource(from: string, to: string) {
  try {
    if (existsSync(to)) {
      removeSync(to)
    }

    copySync(from, to)
    console.log(
      `${chalk.green('success')} - ${chalk.dim(from)} copied to ${chalk.dim(
        to
      )}`
    )
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  }
}

async function finish() {
  // Copy necessary resources to the store directory
  await copyResource(`${tmpDir}/.next`, `${userDir}/.next`)
  await copyResource(`${tmpDir}/lighthouserc.js`, `${userDir}/lighthouserc.js`)

  // Fix Next.js standalone build output directory
  if (existsSync(`${tmpDir}/.next/standalone/.faststore`)) {
    moveSync(`${tmpDir}/.next/standalone/.faststore`, `${tmpDir}/.next/standalone`)
  }

  // Remove `node_modules` from temporary directory after build
  removeSync(`${tmpDir}/node_modules`)
}
