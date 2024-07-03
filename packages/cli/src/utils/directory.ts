import path from 'path'

// build folder
export const tmpFolderName = '.faststore'

// always returns the root of the project, AKA the starter root or @faststore/core dir root when running in the monorepo
export const getRoot = () => {
  if (process.env.OCLIF_COMPILATION) {
    return ''
  }

  if(process.cwd().endsWith(tmpFolderName)) {
    // if the current working directory is the build folder (tmp folder), return the starter root
    // this makes sure the semantics of the starter root are consistent with the directories declared below
    return path.join(process.cwd(), '..')
  }

  return process.cwd()
}

// starter root
export const userDir = getRoot()

// node_modules folder for faststorer packages
const faststoreDir = path.join(userDir, 'node_modules', '@faststore')

// build folder dir
export const tmpDir = path.join(userDir, tmpFolderName)

// node_modules folder for @faststore/core
const coreFolderName = 'core'
export const coreDir = path.join(faststoreDir, coreFolderName)

// starter src/ folder
const srcFolderName = 'src'
export const userSrcDir = path.join(userDir, srcFolderName)

// build folder's folder to which starter files should always be copied 
const customizationsFolderName = 'customizations'
// build folder's root folder for starter files 
const tmpCustomizationsDir = path.join(tmpDir, srcFolderName, customizationsFolderName)
// build folder's starter src files
export const tmpCustomizationsSrcDir = path.join(tmpCustomizationsDir, srcFolderName)

// starter's folder for themes
export const userThemesFileDir = path.join(userSrcDir, 'themes')
// build folder's dir for theme
export const tmpThemesCustomizationsFile = path.join(tmpCustomizationsSrcDir, 'themes', 'index.scss')

// path segment of cms files for faststore
const cmsFolderName = path.join('cms', 'faststore')
// build folder's cms folder
export const tmpCMSDir = path.join(tmpDir, cmsFolderName)
// node_modules folder for @faststore/core's cms folder
export const coreCMSDir = path.join(coreDir, cmsFolderName)
// starter folder's cms folder
export const userCMSDir = path.join(userDir, cmsFolderName)

// file name for faststore configs
const configFileName = 'faststore.config.js'
// starter's config file
export const userStoreConfigFile = path.join(userDir, configFileName)
// build folder's config file
export const tmpStoreConfigFile = path.join(tmpCustomizationsDir, configFileName)

// cms webhook config file name
const cmsWebhookUrlsFileName = 'cms-webhook-urls.json'
// build folder's dir for webhook config
export const tmpCmsWebhookUrlsFileDir = path.join(tmpDir, cmsWebhookUrlsFileName)
