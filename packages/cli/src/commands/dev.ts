import { Command } from '@oclif/core';
import { spawn } from 'child_process';
import chokidar from 'chokidar';
import dotenv from 'dotenv';

import { readFileSync } from 'fs';
import path from 'path';
import { coreNodeModulesDir, getRoot, tmpDir } from '../utils/directory';
import { generate } from '../utils/generate';

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

async function storeDev() {
  const envVars = dotenv.parse(readFileSync(path.join(getRoot(), 'vtex.env')))

  // NODE_PATH is needed to run the dev script
  // It points to an additional node_modules folder that should be used
  // in case a module is not found in the regular node_modules folder
  //
  // This is needed because some modules, such as @faststore/api, might sometimes be located
  // in the node_modules folder inside node_modules/@faststore/core, which would be normally inaccessible
  // at the tmp folder (.faststore)
  const devProcess = spawn(`NODE_PATH="${coreNodeModulesDir}" yarn dev`, {
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
    const queueChange = (/* path: string, remove: boolean */) => {
      // getContentFromPath(path, remove)

      generate()
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

    await generate({ setup: true })

    storeDev()

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
