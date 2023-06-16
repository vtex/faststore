import path from 'path'

export const getRoot = () => {
  if (process.env.OCLIF_COMPILATION) {
    return ''
  }

  return process.cwd()
}

export const userDir = getRoot()
export const faststoreDir = path.join(userDir, 'node_modules', '@faststore')

export const tmpFolderName = '.faststore'
export const tmpDir = path.join(userDir, tmpFolderName)

export const coreFolderName = 'core'
export const coreDir = path.join(faststoreDir, coreFolderName)

export const srcFolderName = 'src'
export const userSrcDir = path.join(userDir, srcFolderName)

export const customizationsFolderName = 'customizations'
export const tmpCustomizationsDir = path.join(tmpDir, 'src', customizationsFolderName)

export const userThemesFileDir = path.join(userSrcDir, 'themes')
export const tmpThemesCustomizationsFileDir = path.join(tmpCustomizationsDir, 'themes', 'index.scss')

export const cmsFolderName = path.join('cms', 'faststore')
export const tmpCMSDir = path.join(tmpDir, cmsFolderName)
export const coreCMSDir = path.join(coreDir, cmsFolderName)
export const userCMSDir = path.join(userDir, cmsFolderName)

export const configFileName = 'faststore.config.js'
export const userStoreConfigFileDir = path.join(userDir, configFileName)
export const coreStoreConfigFileDir = path.join(coreDir, configFileName)
export const tmpStoreConfigFileDir = path.join(tmpDir, configFileName)

export const userNodeModulesDir = path.join(userDir, 'node_modules')
export const tmpNodeModulesDir = path.join(tmpDir, 'node_modules')

export const cmsWebhookUrlsFileName = 'cms-webhook-urls.json'
export const tmpCmsWebhookUrlsFileDir = path.join(tmpDir, cmsWebhookUrlsFileName)
