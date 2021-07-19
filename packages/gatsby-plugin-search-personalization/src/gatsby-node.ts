import type { PluginOptionsSchemaArgs } from 'gatsby'

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
  Joi.object({
    allowedHosts: Joi.array().items(Joi.string().required()),
  })
