import { promisify } from 'util'
import { join } from 'path'

import Liquid from 'liquid'
import { pathExistsSync, readFile } from 'fs-extra'

const readFileAsync = promisify(readFile)

const Syntax = /([a-z0-9/\\_.-]+)/i
const SyntaxHelp =
  "Syntax Error in 'safe_include' - Valid syntax: safe_include [templateName]"

export class SafeInclude extends Liquid.Tag {
  constructor(template: any, tagName: string, markup: string) {
    super(template, tagName, markup)

    const match = Syntax.exec(markup)

    if (!match) {
      throw new Liquid.SyntaxError(SyntaxHelp)
    }

    this.filepath = this.findFilePath(match[1])
  }

  public async render(context: Record<string, unknown>) {
    const buffer = (await readFileAsync(this.filepath)) as Buffer
    const src = buffer.toString()

    return this.template.engine.parseAndRender(src, context)
  }

  protected findFilePath = (path: string) => {
    const filename = `${path}.liquid`
    const projectPath = join(
      process.cwd(),
      '/src/@vtex/gatsby-theme-checkout/html-templates',
      filename
    )

    if (pathExistsSync(projectPath)) {
      return projectPath
    }

    const pluginPath = join(__dirname, '../../src/html-templates', filename)

    if (pathExistsSync(pluginPath)) {
      return pluginPath
    }

    throw new Error(
      `[gatsby-theme-checkout]: Could not find shadowed file ${filename}`
    )
  }
}
