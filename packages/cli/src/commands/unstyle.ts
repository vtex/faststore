/* eslint-disable node/prefer-promises/fs */
import * as fs from 'fs'

import type { GluegunToolbox } from 'gluegun'

type ReadFilesOptions = {
  dirname?: string
  ignoreDirectories?: string[]
  extensionFiles?: string[]
}

const defaultSettings = {
  ignoreDirectories: ['node_modules', '.git', '.cache', '.public'],
  extensionFiles: ['.ts', '.tsx', '.js', '.jsx', '.css', '.sass'],
  dirname: './src/',
}

function getExtension(filename: string) {
  return `.${filename.split('.').pop()}`
}

function readFiles(options: ReadFilesOptions, onFileContent, onError) {
  const defaultOptions = { ...defaultSettings, ...options }
  const { dirname, ignoreDirectories, extensionFiles } = defaultOptions

  fs.readdir(dirname, (err, filenames) => {
    if (err) {
      onError(err)

      return
    }

    filenames.forEach((filename) => {
      if (ignoreDirectories.includes(filename)) {
        return
      }

      const stats = fs.statSync(`${dirname}${filename}`)

      if (stats.isDirectory()) {
        readFiles({ dirname: `${dirname}${filename}/` }, onFileContent, onError)

        return
      }

      const extension = getExtension(filename)

      if (!extensionFiles.includes(extension)) {
        return
      }

      fs.readFile(`${dirname}${filename}`, 'utf-8', () => {
        if (err) {
          onError(err)

          return
        }

        onFileContent(`${dirname}${filename}`)
      })
    })
  })
}

function rewriteAsync(dirname: string, themeRegex: RegExp) {
  fs.readFile(dirname, 'utf-8', (err, data) => {
    if (err) throw err

    if (!themeRegex.test(data)) {
      return
    }

    const newValue = data.replace(themeRegex, '')

    fs.writeFile(dirname, newValue, 'utf-8', (writeErr) => {
      if (writeErr) throw writeErr
    })
  })
}

module.exports = {
  name: 'unstyle',
  alias: ['u'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { info, error },
      filesystem,
      packageManager,
    } = toolbox

    readFiles(
      {},
      (filename) => {
        rewriteAsync(filename, new RegExp(/.*@vtex\/theme-.*\n/g))
      },
      (err) => {
        error(err)
      }
    )

    const { dependencies, devDependencies } = await filesystem.read(
      'package.json',
      'json'
    )

    const themePackages = [
      ...Object.keys(dependencies),
      ...Object.keys(devDependencies),
    ].filter((pack) => new RegExp(/.*@vtex\/theme-.*/g).test(pack))

    info('Removing packages...')

    themePackages.forEach((themePackage) => {
      packageManager.remove(themePackage, {})
    })
  },
}
