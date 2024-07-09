import { Command } from '@oclif/core';
import { spawn } from 'child_process';
import chokidar from 'chokidar';
import dotenv from 'dotenv';

import { readFileSync } from 'fs';
import path from 'path';
import { withBasePath } from '../utils/directory';
import { generate } from '../utils/generate';
import { getPreferredPackageManager } from '../utils/commands';

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

async function storeDev(rootDir: string, tmpDir: string) {
  const envVars = dotenv.parse(readFileSync(path.join(rootDir, 'vtex.env')))

  const packageManager = getPreferredPackageManager()

  const devProcess = spawn(`${packageManager} run dev`, {
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

export default class Dev extends Command {
  async run() {
    const basePath = process.cwd()

    const { getRoot, tmpDir } = withBasePath(basePath)

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

    storeDev(getRoot(), tmpDir)

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
