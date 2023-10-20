import path from 'path'

export const getRoot = () => {
  if (process.env.OCLIF_COMPILATION) {
    return ''
  }

  return process.cwd()
}

// starter root
export const userDir = getRoot()

// node_modules folder for faststorer packages
export const faststoreDir = path.join(userDir, 'node_modules', '@faststore')

// build folder
export const tmpFolderName = '.faststore'
export const tmpDir = path.join(userDir, tmpFolderName)

// node_modules folder for @faststore/core
export const coreFolderName = 'core'
export const coreDir = path.join(faststoreDir, coreFolderName)

// starter src/ folder
export const srcFolderName = 'src'
export const userSrcDir = path.join(userDir, srcFolderName)

// build folder's folder to which starter files should always be copied 
export const customizationsFolderName = 'customizations'
// build folder's root folder for starter files 
export const tmpCustomizationsDir = path.join(tmpDir, 'src', customizationsFolderName)
// build folder's starter src files
export const tmpCustomizationsSrcDir = path.join(tmpCustomizationsDir, srcFolderName)

// starter's folder for themes
export const userThemesFileDir = path.join(userSrcDir, 'themes')
// build folder's dir for theme
export const tmpThemesCustomizationsFileDir = path.join(tmpCustomizationsSrcDir, 'themes', 'index.scss')

// path segment of cms files for faststore
export const cmsFolderName = path.join('cms', 'faststore')
// build folder's cms folder
export const tmpCMSDir = path.join(tmpDir, cmsFolderName)
// node_modules folder for @faststore/core's cms folder
export const coreCMSDir = path.join(coreDir, cmsFolderName)
// starter folder's cms folder
export const userCMSDir = path.join(userDir, cmsFolderName)

// file name for faststore configs
export const configFileName = 'faststore.config.js'
// starter's config file dir
export const userStoreConfigFileDir = path.join(userDir, configFileName)
// build folder's config file dir
export const tmpStoreConfigFileDir = path.join(tmpCustomizationsDir, configFileName)

// starter's node_modules
export const userNodeModulesDir = path.join(userDir, 'node_modules')
// build folder's node_modules
export const tmpNodeModulesDir = path.join(tmpDir, 'node_modules')

// cms webhook config file name
export const cmsWebhookUrlsFileName = 'cms-webhook-urls.json'
// build folder's dir for webhook config
export const tmpCmsWebhookUrlsFileDir = path.join(tmpDir, cmsWebhookUrlsFileName)
