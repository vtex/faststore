import fse from 'fs-extra'
import fs from 'fs'
import deepmerge from 'deepmerge'

import {
  CMSCoreDir,
  CMSCustomDir,
  CMSTmpDir,
  coreDir,
  customizationsDir,
  customSrcDir,
  repoDir,
  storeConfigCoreFileDir,
  storeConfigFileDir,
  storeConfigTmpFileDir,
  themeCustomizationsFileDir,
  themesFileDir,
  tmpDir,
  tmpFolderName,
} from './directory'

interface GenerateOptions {
  setup?: boolean
}

const ignoredDirs = ['node_modules']

async function importStoreConfig() {
  const { default: storeConfig } = await import(`${repoDir}/store.config.js`)
  return storeConfig
}

function createTmpFolder() {
  try {
    fse.mkdirsSync(tmpDir)
  } catch (err) {
    console.error(err)
  } finally {
    console.log(`Temporary folder ${tmpFolderName} created`)
  }
}

function copyCoreFiles() {
  try {
    fse.copySync(coreDir, tmpDir, {
      filter(src) {
        const splittedSrc = src.split('/')
        return ignoredDirs.indexOf(splittedSrc[splittedSrc.length - 1]) === -1
      },
    })
  } catch (e) {
    console.error(e)
  } finally {
    console.log(`Core files copied`)
  }
}

function copyCustomSrcToCustomizations() {
  try {
    fse.copySync(customSrcDir, customizationsDir)
  } catch (err) {
    console.error(err)
  } finally {
    console.log('Copied custom files')
  }
}

async function copyTheme() {
  const storeConfig = await importStoreConfig()

  try {
    fs.copyFileSync(
      `${themesFileDir}/${storeConfig.theme}.scss`,
      themeCustomizationsFileDir
    )
  } catch (err) {
    console.error(err)
  } finally {
    console.log('Copied custom styles')
  }
}

function mergeCMSFile(fileName: string) {
  const coreContentTypes = fs.readFileSync(`${CMSCoreDir}/${fileName}`, 'utf8')
  const customContentTypes = fs.readFileSync(
    `${CMSCustomDir}/${fileName}`,
    'utf8'
  )
  const coreContentTypesJSON = JSON.parse(coreContentTypes)
  const customContentTypesJSON = JSON.parse(customContentTypes)

  const mergeContentTypes = [...coreContentTypesJSON, ...customContentTypesJSON]

  try {
    fs.writeFileSync(
      `${CMSTmpDir}/${fileName}`,
      JSON.stringify(mergeContentTypes)
    )
  } catch (err) {
    console.error(err)
  } finally {
    console.log(`CMS file ${fileName} created`)
  }
}

function generateStoreConfigFile(content: any) {
  return `module.exports = ${JSON.stringify(content)}\n`
}

async function copyStoreConfig() {
  try {
    const storeConfigFromStore = await import(storeConfigFileDir)
    const storeConfigFromCore = await import(storeConfigCoreFileDir)

    const mergedStoreConfig = deepmerge(
      storeConfigFromCore,
      storeConfigFromStore
    )

    fs.writeFileSync(
      storeConfigTmpFileDir,
      generateStoreConfigFile(mergedStoreConfig)
    )
  } catch (err) {
    console.error(err)
  } finally {
    console.log(`File store.config.js copied`)
  }
}

function mergeCMSFiles() {
  try {
    fse.mkdirsSync(`${tmpDir}/cms`)
  } catch (err) {
    console.error(err)
  } finally {
    console.log(`CMS file created`)
  }

  mergeCMSFile('content-types.json')
  mergeCMSFile('sections.json')
}

export async function generate(options?: GenerateOptions) {
  const { setup = false } = options ?? {}

  let setupPromise: Promise<unknown> | null = null

  if (setup) {
    setupPromise = Promise.all([createTmpFolder(), copyCoreFiles()])
  }

  await Promise.all([
    setupPromise,
    copyCustomSrcToCustomizations(),
    copyTheme(),
    mergeCMSFiles(),
    copyStoreConfig(),
  ])
}
