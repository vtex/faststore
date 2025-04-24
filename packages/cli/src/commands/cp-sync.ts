import { Command, Flags } from '@oclif/core'
import chalk from 'chalk'
import path from 'path'
import { withBasePath } from '../utils/directory'
import { generate } from '../utils/generate'
import { generateFullSchema } from '../utils/contentPlatform'
import { writeJsonSync } from 'fs-extra'

export default class ContentPlatformSync extends Command {
  static flags = {
    ['dry-run']: Flags.boolean({
      char: 'd',
      description:
        "Run the full command, but don't upload anything to Content Platform.",
    }),
    local: Flags.string({
      char: 'l',
      helpValue: 'path-to-schema-file',
      description:
        "Use a local schema as the base schema instead of the latest FastStore schema from CP's registry.",
    }),
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
      path.join(userDir, args.component_schemas_path),
      path.join(userDir, args.content_types_path),
      flags.local ? path.join(userDir, flags.local) : null
    )

    if (flags['dry-run']) {
      console.log(
        `${chalk.green('info')} - Full CP schema created sucessfully!`
      )

      writeJsonSync(path.join(userDir, 'schema_result.json'), fullSchema, {
        spaces: 2,
      })

      return
    }

    // await sendToRegistry(fullSchema);
  }
}
