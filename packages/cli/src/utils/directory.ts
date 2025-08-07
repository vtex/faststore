import path from 'path'
import fs from 'node:fs'

export const withBasePath = (basepath: string) => {
  const tmpFolderName = '.faststore'

  // The basepath is where the discovery code is. It's either . or the path configured on faststore.json
  const getRoot = () => basepath

  /*
   * This will loop from the basepath until the process.cwd() looking for node_modules/@faststore/core
   *
   * If it reaches process.cwd() (or /, as a safeguard), without finding it, it will throw an exception
   */
  const getCorePackagePath = () => {
    const packageFromNodeModules = path.join(
      'node_modules',
      '@faststore',
      'core'
    )
    const resolvedCwd = path.resolve(process.cwd())

    const parents: string[] = []

    let attemptedPath
    do {
      attemptedPath = path.join(
        resolvedCwd,
        basepath,
        ...parents,
        packageFromNodeModules
      )

      if (fs.existsSync(attemptedPath)) {
        return attemptedPath
      }

      parents.push('..')
    } while (
      path.resolve(attemptedPath) !== resolvedCwd ||
      path.resolve(attemptedPath) !== '/'
    )

    throw `Could not find @node_modules on ${basepath} or any of its parents until ${attemptedPath}`
  }

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
    tmpCMSDir: path.join(tmpDir, 'cms', 'faststore'),
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
