module.exports.pluginOptionsSchema = ({ Joi }) =>
  Joi.object({
    server: Joi.string().required(),
    sizes: Joi.array().items(Joi.string().required()),
    basePath: Joi.string(),
  })

module.exports.createPages = (
  { actions: { createRedirect } },
  { server, sizes, basePath }
) => {
  if (typeof basePath !== 'string') {
    return
  }

  for (const size of sizes) {
    createRedirect({
      fromPath: `${basePath}/${size}/*`,
      toPath: `${server}/unsafe/${size}/:splat`,
      statusCode: 200,
    })

    createRedirect({
      fromPath: `${basePath}/:p1/${size}/*`,
      toPath: `${server}/unsafe/:p1/${size}/:splat`,
      statusCode: 200,
    })

    createRedirect({
      fromPath: `${basePath}/:p1/:p2/${size}/*`,
      toPath: `${server}/unsafe/:p1/:p2/${size}/:splat`,
      statusCode: 200,
    })

    createRedirect({
      fromPath: `${basePath}/:p1/:p2/:p3/${size}/*`,
      toPath: `${server}/unsafe/:p1/:p2/:p3/${size}/:splat`,
      statusCode: 200,
    })
  }
}
