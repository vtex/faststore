import { Command, Flags } from '@oclif/core'
import { spawn } from 'child_process'
import { withBasePath } from '../utils/directory'
import { generate } from '../utils/generate'
import { mergeCMSFiles } from '../utils/hcms'

export default class CmsSync extends Command {
  static flags = {
    ['dry-run']: Flags.boolean({ char: 'd' }),
  }

  async run() {
    const { flags } = await this.parse(CmsSync)

    const basePath = process.cwd()
    const { tmpDir } = withBasePath(basePath)

    await generate({ setup: true, basePath })
    await mergeCMSFiles(basePath)

    if (flags['dry-run']) {
      return
    }

    return spawn(`vtex cms sync faststore`, {
      shell: true,
      cwd: tmpDir,
      stdio: 'inherit',
    })
  }
}
