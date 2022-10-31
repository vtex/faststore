export const getRoot = () => {
  if (process.env.OCLIF_COMPILATION) {
    return ''
  }

  return process.cwd()
}

export const repoDir = getRoot()
export const faststoreDir = `${repoDir}/node_modules/@faststore`

export const tmpFolderName = '.faststore'
export const tmpDir = `${repoDir}/${tmpFolderName}`

export const coreDir = `${faststoreDir}/core`

export const customSrcDir = `${repoDir}/src`

export const customizationsFolderName = 'customizations'
export const customizationsDir = `${tmpDir}/src/${customizationsFolderName}`

export const themesFileDir = `${customSrcDir}/themes`
export const themeCustomizationsFileDir = `${customizationsDir}/themes/index.scss`

export const CMSTmpDir = `${tmpDir}/cms`
export const CMSCoreDir = `${coreDir}/cms`
export const CMSCustomDir = `${repoDir}/cms`

export const storeConfigFileDir = `${repoDir}/store.config.js`
export const storeConfigCoreFileDir = `${coreDir}/store.config.js`
export const storeConfigTmpFileDir = `${tmpDir}/store.config.js`