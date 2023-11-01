import { Command } from '@oclif/core'
import chalk from 'chalk'
import { spawnSync } from 'child_process'
import { existsSync } from 'fs'
import {  moveSync, removeSync } from 'fs-extra'
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

    if(yarnBuildResult.status && yarnBuildResult.status !== 0) {
      process.exit(yarnBuildResult.status)
    }

    await moveResource(`${tmpDir}/.next`, `${userDir}/.next`)
    await moveResource(`${tmpDir}/public`, `${userDir}/public`)
    await moveResource(
      `${tmpDir}/lighthouserc.js`,
      `${userDir}/lighthouserc.js`
    )
    await moveResource(
      `${tmpDir}/cms-webhook-urls.json`,
      `${userDir}/cms-webhook-urls.json`
    )
    
    // if (existsSync(`.next/standalone`)) {
    //   await copyResource(
    //     `${userDir}/node_modules`,
    //     `.next/standalone/node_modules`
    //   )
    // }
  }
}

async function moveResource(from: string, to: string) {
  try {
    if (existsSync(to)) {
      removeSync(to)
    }

    moveSync(from, to)
    console.log(
      `${chalk.green('success')} - ${chalk.dim(from)} copied to ${chalk.dim(
        to
      )}`
    )
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  }
}
// async function copyResource(from: string, to: string) {
//   try {
//     if (existsSync(to)) {
//       removeSync(to)
//     }

//     copySync(from, to)
//     console.log(
//       `${chalk.green('success')} - ${chalk.dim(from)} copied to ${chalk.dim(
//         to
//       )}`
//     )
//   } catch (err) {
//     console.error(`${chalk.red('error')} - ${err}`)
//   }
// }
