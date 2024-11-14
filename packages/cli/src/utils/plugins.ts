import { copySync, existsSync, mkdirSync, writeFileSync } from 'fs-extra'
import { withBasePath } from './directory'
import path from 'path'
import { logger } from './logger'

type PageConfig = {
  path: string
  appLayout: boolean
  name: string
}

type Plugin =
  | string
  | {
      [pluginName: string]: {
        pages?: { [pageName: string]: Partial<PageConfig> }
      }
    }

const pluginConfigFileName = 'plugin.config.js'

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

  return plugin[Object.keys(plugin)[0]]
}

const getPluginSrcPath = async (basePath: string, pluginName: string) => {
  const { getPackagePath } = withBasePath(basePath)
  return getPackagePath(pluginName, 'src')
}

export const getPluginsList = async (basePath: string): Promise<Plugin[]> => {
  const { tmpStoreConfigFile } = withBasePath(basePath)

  const { plugins = [] } = await import(tmpStoreConfigFile)

  return plugins
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

const getPluginPageFileContent = (
  pluginName: string,
  pageName: string,
  appLayout: boolean
) => `
// GENERATED FILE
import * as page from 'src/plugins/${pluginName}/pages/${pageName}';
${appLayout ? `import GlobalSections, { getGlobalSectionsData } from 'src/components/cms/GlobalSections'` : ``}

export async function getStaticProps({previewData}) {
  const noop = async function() {}
  const loaderData = await (page.loader || noop)()
${appLayout ? `const globalSections = await getGlobalSectionsData(previewData)` : ``}

  return { 
    props: { 
        data: loaderData, 
        ${appLayout ? 'globalSections: globalSections' : ``}
    } 
  }
}
export default function Page(props) { 
  ${
    appLayout
      ? `return <GlobalSections {...props.globalSections}>
            {page.default(props.data)}
          </GlobalSections>`
      : `return page.default(props.data)`
  }
}
      `

const generatePluginPages = async (basePath: string, plugins: Plugin[]) => {
  const { tmpPagesDir, getPackagePath } = withBasePath(basePath)

  logger.log('Generating plugin pages')

  plugins.forEach(async (plugin) => {
    const pluginName = getPluginName(plugin)
    const pluginConfigPath = getPackagePath(pluginName, pluginConfigFileName)

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

export const installPlugins = async (basePath: string) => {
  const plugins = await getPluginsList(basePath)

  copyPluginsSrc(basePath, plugins)
  generatePluginPages(basePath, plugins)
  addPluginsSections(basePath, plugins)
}
