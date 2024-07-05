import { Command } from '@oclif/core'
import chalk from 'chalk'
import { spawnSync } from 'child_process'
import { existsSync } from 'fs'
import { copySync, moveSync, readdirSync, removeSync } from 'fs-extra'
import { withBasePath } from '../utils/directory'
import { generate } from '../utils/generate'

export default class Build extends Command {
  async run() {
    const basePath = process.cwd()

    const { tmpDir } = withBasePath(basePath)

    await generate({ setup: true, basePath })

    const yarnBuildResult = spawnSync(`yarn build`, {
      shell: true,
      cwd: tmpDir,
      stdio: 'inherit',
    })

    if (yarnBuildResult.status && yarnBuildResult.status !== 0) {
      process.exit(yarnBuildResult.status)
    }

    await normalizeStandaloneBuildDir(basePath)
    await copyResources(basePath)
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

async function normalizeStandaloneBuildDir(basePath: string) {
  const { tmpDir } = withBasePath(basePath)

  // Fix Next.js v13+ standalone build output directory
  if (existsSync(`${tmpDir}/.next/standalone/.faststore`)) {
    const standaloneBuildFiles = readdirSync(
      `${tmpDir}/.next/standalone/.faststore`
    )

    await Promise.all(
      standaloneBuildFiles.map((file) =>
        moveSync(
          `${tmpDir}/.next/standalone/.faststore/${file}`,
          `${tmpDir}/.next/standalone/${file}`,
          { overwrite: true }
        )
      )
    )
    removeSync(`${tmpDir}/.next/standalone/.faststore`)
  }
}

async function copyResources(basePath: string) {
  const { tmpDir, userDir } = withBasePath(basePath)

  await copyResource(`${tmpDir}/.next`, `${userDir}/.next`)
  await copyResource(`${tmpDir}/lighthouserc.js`, `${userDir}/lighthouserc.js`)
  await copyResource(`${tmpDir}/public`, `${userDir}/public`)
}
