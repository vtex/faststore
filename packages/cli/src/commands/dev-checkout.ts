import { Command } from '@oclif/core';
import chokidar from 'chokidar';

import { getRoot } from '../utils/directory';
import path from 'path';
import { generateCheckout } from '../utils/generate-checkout';
import { spawn } from 'child_process';

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


async function checkoutDev() {
  // NODE_PATH is needed to run the dev script
  // It points to an additional node_modules folder that should be used
  // in case a module is not found in the regular node_modules folder
  //
  // This is needed because some modules, such as @faststore/api, might sometimes be located
  // in the node_modules folder inside node_modules/@faststore/core, which would be normally inaccessible
  // at the tmp folder (.faststore)
  const devProcess = spawn(`yarn checkout:start`, {
    shell: true,
    cwd: getRoot(),
    signal: devAbortController.signal,
    stdio: 'inherit',
  })

  devProcess.on('close', () => {
    devAbortController.abort()
  })
}

// 
export default class DevCheckout extends Command {
  async run() {
    const queueChange = (/* path: string, remove: boolean */) => {
      // getContentFromPath(path, remove)

      generateCheckout()
    }

    const watcher = chokidar.watch([...defaultPatterns], {
      atomic: stabilityThreshold,
      awaitWriteFinish: {
        stabilityThreshold,
      },
      cwd: path.join(getRoot(), './packages/apps/checkout'),
      ignoreInitial: true,
      ignored: defaultIgnored,
      persistent: true,
      usePolling: process.platform === 'win32',
    })

    devAbortController.signal.addEventListener('abort', () => {
      watcher.close()
    })

    await generateCheckout({ setup: true })

    checkoutDev()

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
