import fse from 'fs-extra'
import fs from 'fs'
import getRoot from './getRoot'

const repoDir = getRoot()
const faststoreDir = `${repoDir}/node_modules/@faststore`

const tmpFolderName = ".faststore"
const tmpDir = `${repoDir}/${tmpFolderName}`;

const coreDir = `${faststoreDir}/core`

const customSrcDir = `${repoDir}/src`;

const customizationsFolderName = "customizations"
const customizationsDir = `${tmpDir}/src/${customizationsFolderName}`

const themesFileDir = `${customSrcDir}/themes`
const themeCustomizationsFileDir = `${customizationsDir}/index.scss`

const CMSTmpDir = `${tmpDir}/cms`
const CMSCoreDir = `${coreDir}/cms`
const CMSCustomDir = `${repoDir}/cms`

const storeConfigFileDir = `${repoDir}/store.config.js`
const storeConfigTmpFileDir = `${tmpDir}/store.config.js`

const ignoredDirs = ["cms", "node_modules"]

async function importStoreConfig() {
  const { default: storeConfig } = await import(`${repoDir}/store.config.js`)
  return storeConfig
}

function createTmpFolder() {
  try{
    fse.mkdirsSync(tmpDir)
  }catch(err){
    console.error(err)
  }finally {
    console.log(`Temporary folder ${tmpFolderName} created`)
  }
}

function copyCoreFiles() {
  try {
    fse.copySync(coreDir, tmpDir, { filter(src) {
      const splittedSrc = src.split("/")
      return ignoredDirs.indexOf(splittedSrc[splittedSrc.length-1]) === -1
    }});
  } catch (e) {
    console.error(e);
  }finally {
    console.log(`Core files copied`)
  }
}

function copyCustomSrcToCustomizations () {
  try {
    fse.copySync(customSrcDir, customizationsDir);
  }catch(err){
    console.error(err);
  }finally {
    console.log("Copied custom files")
  }
}

async function copyTheme () {
  const storeConfig = await importStoreConfig()

  try{
    fs.copyFileSync(`${themesFileDir}/${storeConfig.theme}.scss`, themeCustomizationsFileDir);
  }catch(err){
    console.error(err)
  }finally{
    console.log("Copied custom styles")
  }
}

function mergeCMSFile (fileName: string) {

  const coreContentTypes = fs.readFileSync(`${CMSCoreDir}/${fileName}`, 'utf8')
  const customContentTypes = fs.readFileSync(`${CMSCustomDir}/${fileName}`, 'utf8')
  const coreContentTypesJSON = JSON.parse(coreContentTypes)
  const customContentTypesJSON = JSON.parse(customContentTypes)

  const mergeContentTypes = [...coreContentTypesJSON, ...customContentTypesJSON]

  try{
    fs.writeFileSync(`${CMSTmpDir}/${fileName}`, JSON.stringify(mergeContentTypes));
  }catch(err){
    console.error(err)
  }finally{
    console.log(`CMS file ${fileName} created`)
  }
}

function copyStoreConfig() {
  try{
    fs.copyFileSync(storeConfigFileDir, storeConfigTmpFileDir);
  }catch(err){
    console.error(err)
  }finally{
    console.log(`File store.config.js copied`)
  }
}

function mergeCMSFiles () {
  try{
    fse.mkdirsSync(`${tmpDir}/cms`)
  } catch(err) {
    console.error(err)
  }finally {
    console.log(`CMS file created`)
  }

  mergeCMSFile("content-types.json")
  mergeCMSFile("sections.json")
}


export async function generate() {
  createTmpFolder()
  copyCoreFiles()
  copyCustomSrcToCustomizations()
  copyTheme()
  mergeCMSFiles()
  copyStoreConfig()
}                                 
