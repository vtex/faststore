import { Command } from '@oclif/core'
import chalk from 'chalk'
import { spawnSync } from 'child_process'
import { existsSync, writeFileSync } from 'fs'
import { copy, removeSync } from 'fs-extra'
import stringifyObject from 'stringify-object'
import { tmpDir, tmpNextConfigFile, userDir } from '../utils/directory'
import { generate } from '../utils/generate'

export default class Build extends Command {
  async run() {
    await generate({ setup: true })
    await changesNextConfigFile()
    spawnSync(`yarn build`, {
      shell: true,
      cwd: tmpDir,
      stdio: 'inherit',
    })

    await copyResource(`${tmpDir}/public`, `${userDir}/public`)
    await copyResource(`${tmpDir}/vtex.env`, `${userDir}/vtex.env`)
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

async function changesNextConfigFile() {
  try {
    if (!existsSync(tmpNextConfigFile)) return

    const nextConfigFromTmp = await import(tmpNextConfigFile)
    // avoid duplicate default values
    const { default: defaulValues, ...otherProps } = nextConfigFromTmp

    const mergeNextConfig = {
      ...otherProps,
    }

    writeFileSync(tmpNextConfigFile, generateNextConfigFile(mergeNextConfig))
    console.log(
      `${chalk.green('success')} - File ${chalk.dim(
        tmpNextConfigFile
      )} changed.`
    )
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  }
}

// TODO use template engine
function generateNextConfigFile(content: any) {
  const prettyObject = stringifyObject(content, {
    indent: '  ',
    singleQuotes: false,
  }).slice(1, -1)
  return `const path = require("path")

  const nextConfig = {
    ${prettyObject},
    output: 'standalone',
    distDir: '../.next',
    experimental: {
      outputFileTracingRoot: path.join(__dirname, '../'),
    },
  }

  module.exports = nextConfig`
}
