import { Command, Flags } from '@oclif/core'
import chalk from 'chalk'
import { spawnSync } from 'child_process'
import { existsSync } from 'fs'
import { copySync, moveSync, readdirSync, removeSync } from 'fs-extra'
import { getPreferredPackageManager } from '../utils/commands'
import { checkDeprecatedSecretFiles } from '../utils/deprecations'
import { getBasePath, withBasePath } from '../utils/directory'
import { generate } from '../utils/generate'
import { logger } from '../utils/logger'

export default class Build extends Command {
  static args = [
    {
      name: 'account',
      description:
        'The account for which the Discovery is running. Currently noop.',
    },
    {
      name: 'path',
      description:
        'The path where the FastStore being built is. Defaults to cwd.',
    },
  ]

  static flags = {
    ['no-verify']: Flags.boolean({
      description:
        'Skips verification of faststore dependencies version string to prevent usage of packages outside npm registry.',
    }),
  }

  async run() {
    const { args, flags } = await this.parse(Build)

    const basePath = getBasePath(args.path)

    // Check for deprecated secret files
    checkDeprecatedSecretFiles(basePath)

    if (!flags['no-verify']) {
      const invalidPackages = await checkDeps(basePath)
      invalidPackages.forEach((pkg) =>
        logger.warn(
          `${chalk.yellow(
            'warning'
          )} - Dependency ${pkg} has invalid version signature. Please use a semver like ^1.0.0 (check the official releases on https://github.com/vtex/faststore)`
        )
      )
    }

    const { tmpDir } = withBasePath(basePath)

    await generate({ setup: true, basePath })

    // Copy .env file to temporary directory to make NEXT_PUBLIC_* variables available during build
    copyDotenv(basePath, tmpDir)

    const packageManager = getPreferredPackageManager()

    const buildResult = spawnSync(`${packageManager} run build`, {
      shell: true,
      cwd: tmpDir,
      stdio: 'inherit',
    })

    if (buildResult.status && buildResult.status !== 0) {
      process.exit(buildResult.status)
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

  if (process.env.BUILD_CONTEXT === 'vercel') {
    const toDir = process.cwd()

    // Because of how copyResource works (delete the target directory if it exists),
    // if we're moving something to the same place it is it will break.
    const nextOutputDirectory = `${tmpDir}/.next`
    const expectedOutputDirectory = `${toDir}/.faststore/.next`
    if (nextOutputDirectory !== expectedOutputDirectory) {
      await copyResource(nextOutputDirectory, expectedOutputDirectory)
    }
    await copyResource(`${tmpDir}/public`, `${toDir}/public`)
  } else {
    await copyResource(`${tmpDir}/.next`, `${userDir}/.next`)
    await copyResource(
      `${tmpDir}/lighthouserc.js`,
      `${userDir}/lighthouserc.js`
    )
    await copyResource(`${tmpDir}/public`, `${userDir}/public`)
  }
}

async function checkDeps(basePath: string): Promise<Array<string>> {
  const packageJsonPath = `${basePath}/package.json`
  if (!existsSync(packageJsonPath)) {
    console.log(
      `${chalk.yellow(
        'warning'
      )} - package.json not found at ${packageJsonPath}`
    )
  }

  try {
    const {
      devDependencies = {},
      dependencies = {},
      peerDependencies = {},
    } = await import(packageJsonPath)

    const allDeps: Record<string, string> = Object.assign(
      {},
      peerDependencies,
      devDependencies,
      dependencies
    )

    const invalidPackages: Array<string> = []

    Object.entries(allDeps).forEach(([pkg, version]) => {
      if (/^@faststore\/.+/i.test(pkg) === false) return

      if (version && /^(http|https|git):.+/.test(version) === true) {
        invalidPackages.push(pkg)
      }
    })

    return invalidPackages
  } catch (err) {
    console.log(
      `${chalk.yellow('warning')} - unable to check @faststore dependencies: ${err}`
    )

    return []
  }
}

export function copyDotenv(basePath: string, tmpPath: string) {
  const dotenvFile = `${basePath}/.env`
  const destinationFile = `${tmpPath}/.env`

  if (existsSync(dotenvFile)) {
    copySync(dotenvFile, destinationFile)
  }
}
