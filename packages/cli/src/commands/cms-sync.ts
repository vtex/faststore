import { Command, Flags } from '@oclif/core'
import { spawn } from 'child_process'
import { tmpDir } from '../utils/directory'
import { generate, generateCMSFiles } from '../utils/generate'

export default class CmsSync extends Command {
  static flags = {
    ['dry-run']: Flags.boolean({ char: 'd' }),
  }

  async run() {
    const { flags } = await this.parse(CmsSync)

    await generate({ setup: true })
    await generateCMSFiles()

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
