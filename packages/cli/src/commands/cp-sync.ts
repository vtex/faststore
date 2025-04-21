import { Command, Flags } from '@oclif/core'
import chalk from 'chalk'
import { withBasePath } from '../utils/directory'
import { generate } from '../utils/generate'
import { generateFullSchema } from '../utils/contentPlatform'

export default class ContentPlatformSync extends Command {
  static flags = {
    ['dry-run']: Flags.boolean({ char: 'd' }),
  }

  static args = [
    {
      name: 'component_schemas_path',
      description: 'Path to a directory containing component schemas.',
      default: 'src/components',
    },
    {
      name: 'content_types_path',
      description: 'Path to a directory containing content type schemas.',
      default: 'content-types.jsonc',
    },
  ]

  async run() {
    const { flags, args } = await this.parse(ContentPlatformSync)

    const basePath = process.cwd()
    const { userDir } = withBasePath(basePath)

    await generate({ setup: true, basePath })

    const fullSchema = await generateFullSchema(
      userDir,
      args.component_schemas_path,
      args.content_types_path
    )

    if (flags['dry-run']) {
      console.log(
        `${chalk.green('info')} - Full CP schema created sucessfully!`
      )

      console.log(fullSchema)

      return
    }

    // await sendToRegistry(fullSchema);
  }
}
