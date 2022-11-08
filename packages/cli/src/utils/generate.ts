import {
  copyFileSync,
  copySync,
  mkdirsSync,
  readFileSync,
  writeFileSync,
} from 'fs-extra'
import deepmerge from 'deepmerge'

import {
  coreCMSDir,
  userCMSDir,
  tmpCMSDir,
  coreDir,
  tmpCustomizationsDir,
  userSrcDir,
  userStoreConfigFileDir,
  coreStoreConfigFileDir,
  tmpStoreConfigFileDir,
  tmpThemesCustomizationsFileDir,
  userThemesFileDir,
  tmpDir,
  tmpFolderName,
} from './directory'

interface GenerateOptions {
  setup?: boolean
}

const ignorePaths = ['node_modules']

function createTmpFolder() {
  try {
    mkdirsSync(tmpDir)
  } catch (err) {
    console.error(err)
  } finally {
    console.log(`Temporary folder ${tmpFolderName} created`)
  }
}

function copyCoreFiles() {
  try {
    copySync(coreDir, tmpDir, {
      filter(src) {
        const fileOrDirName = src.split('/').pop()
        const shouldCopy = fileOrDirName
          ? !ignorePaths.includes(fileOrDirName)
          : true

        return shouldCopy
      },
    })
  } catch (e) {
    console.error(e)
  } finally {
    console.log(`Core files copied`)
  }
}

function copyUserSrcToCustomizations() {
  try {
    copySync(userSrcDir, tmpCustomizationsDir)
  } catch (err) {
    console.error(err)
  } finally {
    console.log('Copied custom files')
  }
}

async function copyTheme() {
  const storeConfig = await import(userStoreConfigFileDir)

  try {
    copyFileSync(
      `${userThemesFileDir}/${storeConfig.theme}.scss`,
      tmpThemesCustomizationsFileDir
    )
  } catch (err) {
    console.error(err)
  } finally {
    console.log('Copied custom styles')
  }
}

function mergeCMSFile(fileName: string) {
  const coreContentTypes = readFileSync(`${coreCMSDir}/${fileName}`, 'utf8')
  const customContentTypes = readFileSync(`${userCMSDir}/${fileName}`, 'utf8')
  const coreContentTypesJSON = JSON.parse(coreContentTypes)
  const customContentTypesJSON = JSON.parse(customContentTypes)

  const mergeContentTypes = [...coreContentTypesJSON, ...customContentTypesJSON]

  try {
    writeFileSync(`${tmpCMSDir}/${fileName}`, JSON.stringify(mergeContentTypes))
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
    const storeConfigFromStore = await import(userStoreConfigFileDir)
    const storeConfigFromCore = await import(coreStoreConfigFileDir)

    const mergedStoreConfig = deepmerge(
      storeConfigFromCore,
      storeConfigFromStore
    )

    writeFileSync(
      tmpStoreConfigFileDir,
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
    mkdirsSync(`${tmpDir}/cms`)
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
    copyUserSrcToCustomizations(),
    copyTheme(),
    mergeCMSFiles(),
    copyStoreConfig(),
  ])
}
