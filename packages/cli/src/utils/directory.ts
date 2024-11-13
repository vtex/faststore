import path from 'path'
import fs from 'node:fs'

export const withBasePath = (basepath: string) => {
  const tmpFolderName = '.faststore'

  const getRoot = () => {
    if (process.env.OCLIF_COMPILATION) {
      return ''
    }

    if (basepath.endsWith(tmpFolderName)) {
      // if the current working directory is the build folder (tmp folder), return the starter root
      // this makes sure the semantics of the starter root are consistent with the directories declared below
      return path.resolve(process.cwd(), path.join(basepath, '..'))
    }

    return path.resolve(process.cwd(), basepath)
  }

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

  const tmpDir = path.join(getRoot(), tmpFolderName)
  const userSrcDir = path.join(getRoot(), 'src')
  const getPackagePath = (...packagePath: string[]) =>
    path.join(getRoot(), 'node_modules', ...packagePath)

  return {
    getRoot,
    getPackagePath,
    userDir: getRoot(),
    userSrcDir,
    userThemesFileDir: path.join(userSrcDir, 'themes'),
    userCMSDir: path.join(getRoot(), 'cms', 'faststore'),
    userLegacyStoreConfigFile: path.join(getRoot(), 'faststore.config.js'),
    userStoreConfigFile: path.join(getRoot(), 'discovery.config.js'),

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
    tmpCMSDir: path.join(tmpDir, 'cms', 'faststore'),
    tmpPagesDir: path.join(tmpDir, 'src', 'pages'),
    tmpPluginsDir: path.join(tmpDir, 'src', 'plugins'),
    tmpCMSWebhookUrlsFile: path.join(tmpDir, 'cms-webhook-urls.json'),
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
