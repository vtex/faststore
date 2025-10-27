import { Args, Command, Flags } from '@oclif/core'
import chalk from 'chalk'
import { spawn } from 'child_process'
import chokidar from 'chokidar'
import dotenv from 'dotenv'

import { cpSync, existsSync, readFileSync } from 'fs'
import path from 'path'
import { getPreferredPackageManager } from '../utils/commands'
import { checkDeprecatedSecretFiles } from '../utils/deprecations'
import { getBasePath, withBasePath } from '../utils/directory'
import { generate } from '../utils/generate'
import { logger } from '../utils/logger'
import { runCommandSync } from '../utils/runCommandSync'

/**
 * Taken from toolbelt
 *
 * https://github.com/vtex/toolbelt/pull/442
 */
const stabilityThreshold = process.platform === 'darwin' ? 100 : 200

const defaultPatterns = ['*/**', '**']

const defaultIgnored = [
  '.DS_Store',
  'README.md',
  '.gitignore',
  'package.json',
  '.git/**',
  '.faststore/**',
  '**/.faststore/**',
]

const defaultNodeModulesIgnored = ['node_modules/**', '**/node_modules/**']

const defaultNodeModulesIgnoredExceptVtexPackages = [
  '**/node_modules/!(@vtex)/**',
]

const devAbortController = new AbortController()

async function storeDev(
  rootDir: string,
  tmpDir: string,
  coreDir: string,
  port: number
) {
  // Only try to read vtex.env if it exists
  let envVars = {}
  const vtexEnvPath = path.join(rootDir, 'vtex.env')

  if (existsSync(vtexEnvPath)) {
    try {
      envVars = dotenv.parse(readFileSync(vtexEnvPath))
    } catch (err) {
      logger.log(
        `${chalk.yellow('warn')} - Error parsing vtex.env file: ${err}`
      )
    }
  }

  const packageManager = getPreferredPackageManager()

  runCommandSync({
    cmd: `${packageManager} predev`,
    errorMessage:
      'GraphQL was not optimized and TS files were not updated. Changes in the GraphQL layer did not take effect',
    throws: 'error',
    cwd: tmpDir,
  })

  const { success } = copyGenerated(
    path.join(tmpDir, '@generated'),
    path.join(coreDir, '@generated')
  )

  if (!success) {
    logger.log(
      `${chalk.yellow('warn')} - Failed to copy @generated schema back to node_modules, autocomplete and DX might be impacted.`
    )
    logger.log(
      `Attempted to copy from ${path.join(tmpDir, '@generated')} to ${path.join(coreDir, '@generated')}`
    )
  }

  const devProcess = spawn(`${packageManager} dev-only --port ${port}`, {
    shell: true,
    cwd: tmpDir,
    signal: devAbortController.signal,
    stdio: ['inherit', 'pipe', 'inherit'],
    env: {
      ...process.env,
      ...envVars,
    },
  })

  let nextStdout = ''
  devProcess.stdout.on('data', (chunk) => {
    nextStdout += chunk
    const lines = nextStdout.split('\n')
    while (lines.length > 1) {
      const line = lines.shift()
      console.log('[DISCOVERY] ', line)
    }
    nextStdout = lines.shift() || ''
  })
  devProcess.stdout.on('end', () => {
    console.log('[DISCOVERY] ', nextStdout)
  })

  devProcess.on('close', () => {
    devAbortController.abort()
  })
}

function copyGenerated(from: string, to: string) {
  try {
    cpSync(from, to, { recursive: true, force: true, dereference: true })

    return { success: true }
  } catch (err) {
    return { success: false }
  }
}

export default class Dev extends Command {
  static args = {
    account: Args.string({
      name: 'account',
      description:
        'The account for which the Discovery is running. Currently noop.',
    }),
    path: Args.string({
      name: 'path',
      description:
        'The path where the FastStore being run is. Defaults to cwd.',
    }),
    port: Args.integer({
      name: 'port',
      description: 'The port where FastStore should run. Defaults to 3000.',
    }),
  }

  static flags = {
    'watch-plugins': Flags.boolean({
      description: 'Enable watching for plugin changes',
      default: false,
    }),
  }

  async run() {
    const { args, flags } = await this.parse(Dev)
    const basePath = getBasePath(args.path)

    const port = args.port ?? 3000
    const watchPlugins = flags['watch-plugins']

    const { getRoot, tmpDir, coreDir } = withBasePath(basePath)

    checkDeprecatedSecretFiles(basePath)

    const queueChange = (/* path: string, remove: boolean */) => {
      generate({ basePath })
    }

    const watcher = chokidar.watch([...defaultPatterns], {
      atomic: stabilityThreshold,
      awaitWriteFinish: {
        stabilityThreshold,
      },
      cwd: getRoot(),
      ignoreInitial: true,
      ignored: [
        ...defaultIgnored,
        ...(watchPlugins
          ? defaultNodeModulesIgnoredExceptVtexPackages
          : defaultNodeModulesIgnored),
      ],
      persistent: true,
      usePolling: process.platform === 'win32',
    })

    devAbortController.signal.addEventListener('abort', () => {
      watcher.close()
    })

    await generate({ setup: true, basePath })

    storeDev(getRoot(), tmpDir, coreDir, port)

    return await new Promise((resolve, reject) => {
      watcher
        .on('add', (/*file*/) => queueChange(/*file, false*/))
        .on('change', (/*file*/) => queueChange(/*file, false*/))
        .on('unlink', (/*file*/) => queueChange(/*file, true*/))
        .on('error', () => {
          devAbortController.abort()
          reject()
        })
        .on('ready', resolve)
    })
  }
}
