import { Command, Flags } from '@oclif/core'
import chalk from 'chalk'
import path from 'path'
import { withBasePath } from '../utils/directory'
import { generate } from '../utils/generate'
import { generateFullSchema } from '../utils/contentPlatform'
import { writeJsonSync } from 'fs-extra'

const SCHEMA_REGISTRY_URL =
  'https://vtex.vtexcommercestable.com.br/api/content-platform/schemas/vtex/faststore'

export default class ContentPlatformSync extends Command {
  static flags = {
    ['dry-run']: Flags.boolean({
      char: 'd',
      description:
        "Run the full command, but don't upload anything to Content Platform. If --out is provided, will generate a JSON file with the result.",
    }),
    out: Flags.string({
      char: 'o',
      helpValue: 'path-to-output-file',
      description:
        'Path to the output file where the generated schema will be saved.',
    }),
    local: Flags.string({
      char: 'l',
      helpValue: 'path-to-schema-file',
      description:
        "Use a local schema as the base schema instead of the latest FastStore schema from CP's registry.",
      exclusive: ['remote'],
    }),
    remote: Flags.string({
      char: 'r',
      helpValue: 'path-to-schema-file',
      description: 'Use a custom remote schema as the base schema.',
      exclusive: ['local'],
      default: SCHEMA_REGISTRY_URL,
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

    const fullSchema = await generateFullSchema({
      componentsPath: path.join(userDir, args.component_schemas_path),
      contentTypesPath: path.join(userDir, args.content_types_path),
      localSchemaPath: flags.local ? path.join(userDir, flags.local) : null,
      remoteSchemaUrl: flags.remote,
    })

    console.log(`${chalk.green('info')} - Full CP schema created sucessfully!`)

    if (flags.out) {
      const outputPath = path.join(userDir, flags.out)

      writeJsonSync(outputPath, fullSchema, { spaces: 2 })

      console.log(
        `${chalk.green('info')} - Full CP schema saved at ${outputPath}`
      )
    }

    if (flags['dry-run']) {
      return
    }

    // await sendToRegistry(fullSchema);
  }
}
