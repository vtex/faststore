import fs from 'node:fs'
import degit from 'degit'
import { Command } from '@oclif/core'
import { confirm } from '@inquirer/prompts'

export default class Init extends Command {
  static args = [
    {
      name: 'path',
      description:
        'The path where the Discovery folder will be created. Defaults to ./discovery.',
    },
  ]

  static description =
    'Creates a discovery folder based on the starter.store template.'

  static examples = ['$ yarn faststore init discovery']

  async run() {
    const { args } = await this.parse(Init)

    const discoveryPath = args.path ?? './discovery'
    const discoveryFolderExists = fs.existsSync(discoveryPath)

    if (discoveryFolderExists) {
      const confirmOverride = await confirm({
        message: `It looks like you already have a discovery folder named "${discoveryPath}" in your store. Do you want to override it?`,
      })

      if (!confirmOverride)
        return this.log('🛑 Interrupted initializing discovery')
    }

    const discoveryEmitter = degit('vtex-sites/starter.store', {
      force: true,
    })

    this.log('Pulling starter.store template...')

    discoveryEmitter.clone(discoveryPath).then(() => {
      this.log(
        `Discovery created successfully! You can find it at ${discoveryPath}`
      )
    })
  }
}
