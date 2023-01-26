import { Command } from '@oclif/core'
import chalk from 'chalk'
import { spawnSync } from 'child_process'
import { existsSync, symlinkSync } from 'fs'
import { copy, removeSync } from 'fs-extra'
import { tmpDir, tmpSrcDir, userDir, userSrcDir } from '../utils/directory'
import { generate } from '../utils/generate'

export default class Build extends Command {
  async run() {
    await generate({ setup: true })
    spawnSync(`yarn build`, {
      shell: true,
      cwd: tmpDir,
      stdio: 'inherit',
    })

    await copyResource(`${tmpDir}/.next`, `${userDir}/.next`)
    await copyResource(
      `${tmpDir}/faststore.config.js`,
      `${userDir}/faststore.config.js`
    )
    await copyResource(`${tmpDir}/public`, `${userDir}/public`)
    await copyResource(`${tmpDir}/vtex.env`, `${userDir}/vtex.env`)
    await copyResource(
      `${tmpDir}/lighthouserc.js`,
      `${userDir}/lighthouserc.js`
    )
    await copyResource(`${tmpDir}/cypress.json`, `${userDir}/cypress.json`)
    if (existsSync(`.next/standalone`)) {
      await copyResource(
        `${userDir}/node_modules`,
        `.next/standalone/node_modules`
      )
    }
    createSrcDirSymbolicLink()
  }
}

async function copyResource(from: string, to: string) {
  try {
    if (existsSync(to)) {
      removeSync(to)
    }

    await copy(from, to)
    console.log(
      `${chalk.green('success')} - ${chalk.dim(from)} copied to ${chalk.dim(
        to
      )}`
    )
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  }
}

// SonarQube looks for src dir in the root folder
function createSrcDirSymbolicLink() {
  try {
    symlinkSync(tmpSrcDir, userSrcDir)
    console.log(
      `${chalk.green('success')} - Symbolic ${chalk.dim(
        'src'
      )} link created from ${chalk.dim(tmpSrcDir)} to ${chalk.dim(userSrcDir)}`
    )
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  }
}
