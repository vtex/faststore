import type { PluginOptionsSchemaArgs } from 'gatsby'

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
  Joi.object({
    pixelId: Joi.string().required(),
  })
