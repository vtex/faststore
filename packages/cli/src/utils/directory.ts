import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const getBasePath = (basePath?: string) => {
  if (basePath) {
    return path.resolve(basePath)
  }

  return process.cwd()
}

export const withBasePath = (basepath: string) => {
  const tmpFolderName = '.faststore'

  // The basepath is where the discovery code is. It's either . or the path configured on faststore.json
  const getRoot = () => basepath

  /*
   * This will loop from the basepath until the process.cwd() looking for node_modules/@faststore/core
   *
   * If it reaches process.cwd() (or /, as a safeguard), without finding it, it will throw an exception
   */
  const getCorePackagePath = () =>
    path.dirname(
      fileURLToPath(import.meta.resolve('@faststore/core', import.meta.url))
    )

  const customizationsDir = getRoot()
  const tmpDir = path.join(process.cwd(), tmpFolderName)
  const userSrcDir = path.join(customizationsDir, 'src')
  const getPackagePath = (...packagePath: string[]) =>
    path.join(customizationsDir, 'node_modules', ...packagePath)

  return {
    getRoot,
    getPackagePath,
    userDir: customizationsDir,
    userSrcDir,
    userThemesFileDir: path.join(userSrcDir, 'themes'),
    userCMSDir: path.join(customizationsDir, 'cms', 'faststore'),
    userLegacyStoreConfigFile: path.join(
      customizationsDir,
      'faststore.config.js'
    ),
    userStoreConfigFile: path.join(customizationsDir, 'discovery.config.js'),

    tmpSeoConfig: path.join(tmpDir, 'next-seo.config.ts'),
    tmpFolderName,
    tmpDir,
    tmpCustomizationsSrcDir: path.join(tmpDir, 'src', 'customizations', 'src'),
    tmpThemesCustomizationsFile: path.join(
      tmpDir,
      'src',
      'customizations',
      'src',
      'themes',
      'index.scss'
    ),
    tmpThemesPluginsFile: path.join(tmpDir, 'src', 'plugins', 'index.scss'),
    tmpCMSDir: (projectName = 'faststore') =>
      path.join(tmpDir, 'cms', projectName),
    tmpCMSWebhookUrlsFile: path.join(tmpDir, 'cms-webhook-urls.json'),
    tmpPagesDir: path.join(tmpDir, 'src', 'pages'),
    tmpApiDir: path.join(tmpDir, 'src', 'pages', 'api'),
    tmpPluginsDir: path.join(tmpDir, 'src', 'plugins'),
    tmpStoreConfigFile: path.join(
      tmpDir,
      'src',
      'customizations',
      'discovery.config.js'
    ),

    coreDir: getCorePackagePath(),
    coreCMSDir: path.join(getCorePackagePath(), 'cms', 'faststore'),
  }
}
