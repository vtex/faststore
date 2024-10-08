import { Command } from '@oclif/core';
import { spawn } from 'child_process';
import chalk from 'chalk';
import chokidar from 'chokidar';
import dotenv from 'dotenv';

import { readFileSync, cpSync } from 'fs';
import path from 'path';
import { withBasePath } from '../utils/directory';
import { generate } from '../utils/generate';
import { getPreferredPackageManager } from '../utils/commands';
import { runCommandSync } from '../utils/runCommandSync';


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
  'node_modules/**',
  '**/node_modules/**',
  '.git/**',
  '.faststore/**',
  '**/.faststore/**',
]

const devAbortController = new AbortController()

async function storeDev(rootDir: string, tmpDir: string, coreDir: string, port: number) {
  const envVars = dotenv.parse(readFileSync(path.join(rootDir, 'vtex.env')))

  const packageManager = getPreferredPackageManager()

  runCommandSync({
    cmd: `${packageManager} predev`,
    errorMessage:
      'GraphQL was not optimized and TS files were not updated. Changes in the GraphQL layer did not take effect',
    throws: 'error',
    debug: true,
    cwd: tmpDir,
  })

  const { success } = copyGenerated(path.join(tmpDir, '@generated'), path.join(coreDir, '@generated'))

  if (!success) {
    console.log(`${chalk.yellow('warn')} - Failed to copy @generated schema back to node_modules, autocomplete and DX might be impacted.`)
    console.log(`Attempted to copy from ${path.join(tmpDir, '@generated')} to ${path.join(coreDir, '@generated')}`)
  }

  const devProcess = spawn(`${packageManager} dev-only --port ${port}`, {
    shell: true,
    cwd: tmpDir,
    signal: devAbortController.signal,
    stdio: 'inherit',
    env: {
      ...process.env,
      ...envVars,
    }
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
  static args = [
    {
      name: 'account',
      description:
      'The account for which the Discovery is running. Currently noop.',
    },
    {
      name: 'path',
      description:
      'The path where the FastStore being run is. Defaults to cwd.',
    },
    {
      name: 'port',
      description: 'The port where FastStore should run. Defaults to 3000.',
    },
  ]

  async run() {
    const { args } = await this.parse(Dev)
    const basePath = args.path ?? process.cwd()
    const port = args.port ?? 3000

    const { getRoot, tmpDir, coreDir } = withBasePath(basePath)

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
      ignored: defaultIgnored,
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
