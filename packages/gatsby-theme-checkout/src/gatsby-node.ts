import { readFile } from 'fs'
import { promisify } from 'util'

import Liquid from 'liquid'
import type { CreatePageArgs, PluginOptionsSchemaArgs } from 'gatsby'

import { vtexIO } from './node-api/filters/vtex_io'
import { legacyFileUrl } from './node-api/filters/legacy-file-url'
import { fileUrl } from './node-api/filters/file-url'
import { SafeInclude } from './node-api/tags/safe-include'
import { VTEX } from './node-api/tags/vtex'

export interface Options {
  storeId: string
  locales: string[]
  defaultLocale: string
}

const readFileAsync = promisify(readFile)
const readFileString = (filepath: string) =>
  readFileAsync(filepath, { encoding: 'utf-8' }).then((buffer) =>
    buffer.toString()
  )

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
  Joi.object({
    storeId: Joi.string().required(),
    locales: Joi.array().items(Joi.string()).required(),
    defaultLocale: Joi.string().required(),
  })

export const createPages = async ({
  actions: { createPage },
}: CreatePageArgs) => {
  // Setup liquid engine
  const engine = new Liquid.Engine()

  engine.registerTag('vtex', VTEX)
  engine.registerTag('safe_include', SafeInclude)

  engine.registerFilters({
    file_url: fileUrl,
    legacy_file_url: legacyFileUrl,
    vtex_io: vtexIO,
  })

  // Read liquid files
  const [headStr, bodyStr] = await Promise.all([
    readFileString(`${__dirname}/src/html-templates/head.liquid`),
    readFileString(`${__dirname}/src/html-templates/body.liquid`),
  ])

  // Liquid Context
  const ctx: Record<string, unknown> = {}

  // Render head and body
  const [headHtml, bodyHtml] = await Promise.all([
    engine.parseAndRender(headStr, ctx),
    engine.parseAndRender(bodyStr, ctx),
  ])

  createPage({
    path: '/checkout',
    matchPath: '/checkout*',
    component: `${__dirname}/src/templates/checkout.tsx`,
    context: {
      body: bodyHtml,
      head: headHtml,
    },
  })
}
