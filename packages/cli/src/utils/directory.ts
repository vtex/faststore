export const getRoot = () => {
  if (process.env.OCLIF_COMPILATION) {
    return ''
  }

  return process.cwd()
}

export const userDir = getRoot()
export const faststoreDir = `${userDir}/node_modules/@faststore`

export const tmpFolderName = '.faststore'
export const tmpDir = `${userDir}/${tmpFolderName}`

export const coreFolderName = 'core'
export const coreDir = `${faststoreDir}/${coreFolderName}`

export const srcFolderName = 'src'
export const userSrcDir = `${userDir}/${srcFolderName}`

export const customizationsFolderName = 'customizations'
export const tmpCustomizationsDir = `${tmpDir}/src/${customizationsFolderName}`

export const userThemesFileDir = `${userSrcDir}/themes`
export const tmpThemesCustomizationsFileDir = `${tmpCustomizationsDir}/themes/index.scss`

export const cmsFolderName = 'cms'
export const tmpCMSDir = `${tmpDir}/${cmsFolderName}`
export const coreCMSDir = `${coreDir}/${cmsFolderName}`
export const userCMSDir = `${userDir}/${cmsFolderName}`

export const storeConfigFileName = 'store.config.js'
export const userStoreConfigFileDir = `${userDir}/${storeConfigFileName}`
export const coreStoreConfigFileDir = `${coreDir}/${storeConfigFileName}`
export const tmpStoreConfigFileDir = `${tmpDir}/${storeConfigFileName}`
