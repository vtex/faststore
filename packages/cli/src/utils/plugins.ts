import {
  copySync,
  existsSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
} from 'fs-extra'
import { withBasePath } from './directory'
import path from 'path'
import { logger } from './logger'

export type PageConfig = {
  path: string
  appLayout: boolean
  name: string
}

export type APIConfig = {
  path: string
}

export type PluginConfig = {
  pages?: { [pageName: string]: Partial<PageConfig> }
  apis?: { [pageName: string]: Partial<APIConfig> }
}

export type Plugin =
  | string
  | {
      [pluginName: string]: PluginConfig
    }

const PLUGIN_CONFIG_FILE = 'plugin.config.js'

const sanitizePluginName = (pluginName: string, pascalCase = false) => {
  const sanitized = pluginName.split('/')[1]

  if (pascalCase) {
    return sanitized
      .toLowerCase()
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }

  return sanitized
}

export const getPluginName = (plugin: Plugin) => {
  if (typeof plugin === 'string') {
    return plugin
  }

  return Object.keys(plugin)[0]
}

const getPluginCustomConfig = (plugin: Plugin) => {
  if (typeof plugin === 'string') {
    return {}
  }

  return plugin[getPluginName(plugin)]
}

const getPluginSrcPath = async (basePath: string, pluginName: string) => {
  const { getPackagePath } = withBasePath(basePath)
  return getPackagePath(pluginName, 'src')
}

export const getPluginsList = async (basePath: string): Promise<Plugin[]> => {
  const { tmpStoreConfigFile } = withBasePath(basePath)

  try {
    const { plugins = [] } = await import(tmpStoreConfigFile)
    return plugins
  } catch (error) {
    logger.error(`Could not load plugins from store config`)
  }

  return []
}

const copyPluginsSrc = async (basePath: string, plugins: Plugin[]) => {
  const { tmpPluginsDir } = withBasePath(basePath)

  logger.log('Copying plugins files')

  plugins.forEach(async (plugin) => {
    const pluginName = getPluginName(plugin)
    const pluginSrcPath = await getPluginSrcPath(
      basePath,
      getPluginName(pluginName)
    )
    const pluginDestPath = path.join(
      tmpPluginsDir,
      sanitizePluginName(pluginName)
    )

    copySync(pluginSrcPath, pluginDestPath)
    logger.log(`Copied ${pluginName} files`)
  })
}

const copyPluginPublicFiles = async (basePath: string, plugins: Plugin[]) => {
  const { tmpDir, getPackagePath } = withBasePath(basePath)

  logger.log('Copying plugin public files')

  plugins.forEach(async (plugin) => {
    const pluginName = getPluginName(plugin)
    const pluginPath = getPackagePath(getPluginName(pluginName))

    try {
      if (existsSync(`${pluginPath}/public`)) {
        copySync(`${pluginPath}/public`, `${tmpDir}/public`, {
          dereference: true,
          overwrite: true,
        })
        logger.log(`Plugin public files copied`)
      }
    } catch (e) {
      logger.error(e)
    }
  })
}

const getPluginPageFileContent = (
  pluginName: string,
  pageName: string,
  appLayout: boolean
) => `
// GENERATED FILE
// @ts-nocheck
import * as page from 'src/plugins/${pluginName}/pages/${pageName}'
${appLayout ? `import { getGlobalSectionsData } from 'src/components/cms/GlobalSections'` : ``}
${appLayout ? `import RenderSections from 'src/components/cms/RenderSections'` : ``}

export async function getServerSideProps(${appLayout ? '{ previewData, ...otherProps }' : 'otherProps'}) {
  const noop = async function() {}
  const loaderData = await (page.loader || noop)(otherProps)
${appLayout ? `const { sections = [] } = await getGlobalSectionsData(previewData)` : ``}

  return {
    props: {
        data: loaderData,
        ${appLayout ? 'globalSections: sections' : ``}
    }
  }
}
export default function Page(props) {
  ${
    appLayout
      ? `return <RenderSections globalSections={props.globalSections}>
            {page.default(props.data)}
          </RenderSections>`
      : `return page.default(props.data)`
  }
}
      `

const generatePluginPages = async (basePath: string, plugins: Plugin[]) => {
  const { tmpPagesDir, getPackagePath } = withBasePath(basePath)

  logger.log('Generating plugin pages')

  plugins.forEach(async (plugin) => {
    const pluginName = getPluginName(plugin)
    const pluginConfigPath = getPackagePath(pluginName, PLUGIN_CONFIG_FILE)

    const pluginConfig = await import(pluginConfigPath)

    const { pages: pagesCustom } = getPluginCustomConfig(plugin)

    const pagesConfig: Record<string, PageConfig> = {
      ...(pluginConfig.pages ?? {}),
      ...pagesCustom,
    }

    const pages = Object.keys(pagesConfig)

    pages.forEach(async (pageName) => {
      const paths = pagesConfig[pageName].path.split('/')

      const pageFile = paths.pop()
      const pagePaths = paths

      const pagePath = path.join(tmpPagesDir, ...pagePaths, pageFile + '.tsx')

      const fileContent = getPluginPageFileContent(
        sanitizePluginName(pluginName),
        pageName,
        pagesConfig[pageName].appLayout
      )

      mkdirSync(path.dirname(pagePath), { recursive: true })
      writeFileSync(pagePath, fileContent)
    })
  })
}

export async function addPluginsSections(basePath: string, plugins: Plugin[]) {
  const { tmpPluginsDir, getPackagePath } = withBasePath(basePath)

  logger.log('Adding plugin sections')

  const indexPluginsOverrides = plugins
    .filter((plugin) =>
      existsSync(
        getPackagePath(getPluginName(plugin), 'src', 'components', 'index.ts')
      )
    )
    .map((plugin) => {
      const pluginReference =
        sanitizePluginName(getPluginName(plugin), true) + 'Components'

      return {
        import: `import { default as ${pluginReference} } from 'src/plugins/${sanitizePluginName(getPluginName(plugin))}/components'`,
        pluginReference,
      }
    })

  const pluginsImportFileContent = `
  ${indexPluginsOverrides.map((plugin) => plugin.import).join('\n')}

  export default {
    ${indexPluginsOverrides.map((plugin) => `...${plugin.pluginReference}`).join(',\n')}
  }
  `

  const sectionPath = path.join(tmpPluginsDir, 'index.ts')
  writeFileSync(sectionPath, pluginsImportFileContent)
  logger.log('Writing plugins overrides')
  logger.log(sectionPath)
  logger.log(pluginsImportFileContent)
}

export async function addPluginsOverrides(basePath: string, plugins: Plugin[]) {
  const { tmpPluginsDir, getPackagePath } = withBasePath(basePath)

  logger.log('Adding plugin overrides')

  plugins
    .map((plugin) => ({
      pluginName: getPluginName(plugin),
      pluginOverridesPath: getPackagePath(
        getPluginName(plugin),
        'src',
        'components',
        'overrides'
      ),
    }))
    .filter(({ pluginOverridesPath }) => existsSync(pluginOverridesPath))
    .reverse()
    .forEach(({ pluginName, pluginOverridesPath }) => {
      const overrideFilesAlreadyCopied: string[] = []

      const sanitizedPluginName = sanitizePluginName(pluginName)

      const overrideFiles = readdirSync(pluginOverridesPath)

      overrideFiles
        .filter((file) => !overrideFilesAlreadyCopied.includes(file))
        .forEach((overrideFileName) => {
          const overrideFileContent = `export { override } from 'src/plugins/${sanitizedPluginName}/components/overrides/${overrideFileName.split('.')[0]}'`

          writeFileSync(
            path.join(tmpPluginsDir, 'overrides', overrideFileName),
            overrideFileContent
          )
          overrideFilesAlreadyCopied.push(overrideFileName)
        })
    })
}

const addPluginsTheme = async (basePath: string, plugins: Plugin[]) => {
  const { getPackagePath, tmpThemesPluginsFile } = withBasePath(basePath)

  const pluginImportsContent = plugins
    .filter((plugin) =>
      existsSync(
        getPackagePath(getPluginName(plugin), 'src', 'themes', 'index.scss')
      )
    )
    .map((plugin) => `@import "${getPluginName(plugin)}/src/themes/index.scss"`)
    .join('\n')

  writeFileSync(tmpThemesPluginsFile, pluginImportsContent)
}

const getPluginAPIFileContent = (pluginName: string, apiName: string) => `
// GENERATED FILE
// @ts-nocheck
import apiHandle from 'src/plugins/${pluginName}/apis/${apiName}'
import { NextApiRequest, NextApiResponse } from "next/types"

export default function handle(req: NextApiRequest, res: NextApiResponse) {
  return apiHandle(req, res)
}
`

const generatePluginApis = async (basePath: string, plugins: Plugin[]) => {
  const { tmpApiDir, getPackagePath } = withBasePath(basePath)

  logger.log('Generating plugin APIs')

  plugins.forEach(async (plugin) => {
    const pluginName = getPluginName(plugin)
    const pluginConfigPath = getPackagePath(pluginName, PLUGIN_CONFIG_FILE)

    const pluginConfig = await import(pluginConfigPath)

    const { apis: apisCustom } = getPluginCustomConfig(plugin)

    const apisConfig: Record<string, APIConfig> = {
      ...(pluginConfig.apis ?? {}),
      ...apisCustom,
    }

    const apis = Object.keys(apisConfig)

    apis.forEach(async (apiName) => {
      const paths = apisConfig[apiName].path.split('/')

      const apiFile = paths.pop()
      const apiPaths = paths

      const apiPath = path.join(
        tmpApiDir,
        ...apiPaths,
        'plugin',
        apiFile + '.ts'
      )

      const fileContent = getPluginAPIFileContent(
        sanitizePluginName(pluginName),
        apiName
      )

      mkdirSync(path.dirname(apiPath), { recursive: true })
      writeFileSync(apiPath, fileContent)
    })
  })
}

export const installPlugins = async (basePath: string) => {
  const plugins = await getPluginsList(basePath)

  copyPluginsSrc(basePath, plugins)
  copyPluginPublicFiles(basePath, plugins)
  generatePluginPages(basePath, plugins)
  generatePluginApis(basePath, plugins)
  addPluginsSections(basePath, plugins)
  addPluginsOverrides(basePath, plugins)
  addPluginsTheme(basePath, plugins)
}
