import type { PluginOptionsSchemaArgs } from 'gatsby'

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
  Joi.object({
    gtmId: Joi.string().required(),
    dataLayerConfig: Joi.array().items(Joi.object()).required(),
  })
