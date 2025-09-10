import { Command } from '@oclif/core'
import path from 'node:path'
import fs from 'node:fs'
import { getBasePath } from '../utils/directory'

export default class Prepare extends Command {
  static args = [
    {
      name: 'path',
      description:
        'The path where the FastStore being run is. Defaults to cwd.',
    },
  ]

  async run() {
    const { args } = await this.parse(Prepare)
    const basePath = getBasePath(args.path)

    const clientPublicDir = path.join(basePath, 'public/')
    const corePublicDir = path.join(
      basePath,
      'node_modules/@faststore/core/public/'
    )

    if (!corePublicDir) {
      throw Error('Please install @faststore/core package')
    }

    copyFolder(corePublicDir, clientPublicDir)
  }
}

function copyFolder(sourceDir: string, targetDir: string) {
  // Ensure target directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  // Read all items in the source directory
  const files = fs.readdirSync(sourceDir)

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file)
    const targetPath = path.join(targetDir, file)

    const stat = fs.statSync(sourcePath)

    if (stat.isFile()) {
      // Copy file
      fs.copyFileSync(sourcePath, targetPath)
      console.log(`Copied file: ${sourcePath} -> ${targetPath}`)
    } else if (stat.isDirectory()) {
      // Recursively copy subfolder
      copyFolder(sourcePath, targetPath)
    }
  }
}
