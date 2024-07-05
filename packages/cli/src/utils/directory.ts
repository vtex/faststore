import path from 'path'

export const withBasePath = (basepath: string) => {
  const tmpFolderName = '.faststore'

  const getRoot = () => {
    if (process.env.OCLIF_COMPILATION) {
      return ''
    }

    if (basepath.endsWith(tmpFolderName)) {
      // if the current working directory is the build folder (tmp folder), return the starter root
      // this makes sure the semantics of the starter root are consistent with the directories declared below
      return path.join(basepath, '..')
    }

    return basepath
  }
  const getFastStorePath = () => {

    // TODO: a more complex version of this would look into the monorepo parent
    return path.join(basepath, 'node_modules', '@faststore')
  }

  const tmpDir = path.join(getRoot(), tmpFolderName)
  const userSrcDir = path.join(getRoot(), 'src')

  return {
    getRoot,
    userDir: getRoot(),
    userSrcDir,
    userThemesFileDir: path.join(userSrcDir, 'themes'),
    userCMSDir: path.join(getRoot(), 'cms', 'faststore'),
    userStoreConfigFile: path.join(getRoot(), 'faststore.config.js'),

    tmpFolderName,
    tmpDir,
    tmpCustomizationsSrcDir: path.join(tmpDir, 'src', 'customizations', 'src'),
    tmpThemesCustomizationsFile: path.join(tmpDir, 'src', 'customizations', 'src', 'themes', 'index.scss'),
    tmpCMSDir: path.join(tmpDir, 'cms', 'faststore'),
    tmpCMSWebhookUrlsFile: path.join(tmpDir, 'cms-webhook-urls.json'),
    tmpStoreConfigFile: path.join(tmpDir, 'src', 'customizations', 'faststore.config.js'),

    coreDir: path.join(getFastStorePath(), 'core'),
    coreCMSDir: path.join(getFastStorePath(), 'core', 'cms', 'faststore'),
  }
}
