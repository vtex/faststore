import type { SourceNodeArgs } from 'gatsby'

export const pluginOptionsSchema = ({ Joi }) =>
  Joi.object({
    sourceProducts: Joi.boolean(),
    sourceCollections: Joi.boolean(),
  })

export const sourceNodes = (gatsbyApi: SourceNodeArgs) => {}
