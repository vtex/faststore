import { Command } from '@oclif/core'
import chalk from 'chalk'
import { spawnSync } from 'child_process'
import { existsSync } from 'fs'
import { copySync, moveSync, readdirSync, removeSync } from 'fs-extra'
import { tmpCustomizationsSrcDir, tmpDir, userDir } from '../utils/directory'
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

    await normalizeStandaloneBuildDir()
    await copyResources()
    buildFastCheckoutComponents()
  }
}

/**
 * TODO: generate the arctifacts to be deployed by the fast checkout
 *
 * here you can run the webpack, but before you'll need to create a allow list
 * with the components that will be used in the fast checkout
 * today we have a restriction that the component must has the name configured
 * in the CMS, but the filename can be different, so we need to look for the
 * component name that is being exported in the file index.tsx in the components
 * folder and then we can build the fast checkout components
 */
function buildFastCheckoutComponents() {
  const allowList = ['Summary']

  const components = readdirSync(`${tmpCustomizationsSrcDir}/components`)
  const allowedComponents = components.filter((component) => {
    const componentName = component.split('.')[0]
    return allowList.includes(componentName)
  })

  console.log('components', components)
  console.log('allowedComponents', allowedComponents)
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

async function normalizeStandaloneBuildDir() {
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

async function copyResources() {
  await copyResource(`${tmpDir}/.next`, `${userDir}/.next`)
  await copyResource(`${tmpDir}/lighthouserc.js`, `${userDir}/lighthouserc.js`)
}
