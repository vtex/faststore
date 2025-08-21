import { Command, Flags } from '@oclif/core'
import { spawn } from 'child_process'
import { getBasePath, withBasePath } from '../utils/directory'
import { generate } from '../utils/generate'
import { mergeCMSFiles } from '../utils/hcms'
import path from 'node:path'

export default class CmsSync extends Command {
  static flags = {
    ['dry-run']: Flags.boolean({ char: 'd' }),
  }

  static args = [
    {
      name: 'path',
      description:
        'The path where the FastStore being synched with the CMS is. Defaults to cwd.',
    },
  ]

  async run() {
    const { flags, args } = await this.parse(CmsSync)

    const basePath = getBasePath(args.path)
    const { tmpDir, userStoreConfigFile } = withBasePath(basePath)

    const userStoreConfig = await import(path.resolve(userStoreConfigFile))
    const builderId = userStoreConfig.contentSource.project

    await generate({ setup: true, basePath })
    await mergeCMSFiles(basePath)

    if (flags['dry-run']) {
      return
    }

    return spawn(`vtex cms sync ${builderId}`, {
      shell: true,
      cwd: tmpDir,
      stdio: 'inherit',
    })
  }
}
