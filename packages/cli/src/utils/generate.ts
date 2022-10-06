import fse from 'fs-extra'
import fs from 'fs'
import util from "util"
import glob from "glob""
import path from "path"
import storeConfig from "./store.config"
import getRoot from './getRoot'

const tmpFolderName = ".tmp"
const tmpDir = `${getRoot()}/${tmpFolderName}`;

const coreDir = `${getRoot()}/core`

const customSrcDir = `${getRoot()}/src`;

const customizationsFolderName = "customizations"
const customizationsDir = `${tmpDir}/${customizationsFolderName}`

const themeFileName = storeConfig.theme
const themesFileDir = `${customSrcDir}/themes/${themeFileName}.scss`
const themeCustomizationsFileDir = `${customizationsDir}/index.scss`

const CMSTmpDir = `${tmpDir}/cms`
const CMSCoreDir = `${coreDir}/cms`
const CMSCustomDir = `${getRoot()}/cms`

const storeConfigFileDir = `${getRoot()}/store.config.js`
const storeConfigTmpFileDir = `${tmpDir}/store.config.js`





const ignoredDirs = ["node_modules", "cms"]

// async function overrideTmpFolder() {
//   const dirs = await glob("*/", { cwd: srcDir, absolute: true, ignore: tmpFolderName }
//   const proms = dirs.map((file) => {
//     const basename = path.basename(file);
//     const dest = path.join(srcDir, ".tmp", basename);
//     return fse.copySync(file, dest, { overwrite: true, filter(srcDir) {
//       return ignoredDirs.indexOf(srcDir) > 1
//     }});
//   });
//   return Promise.all(proms);
// }

function createTmpFolder() {
  try{
    fs.mkdirSync(tmpDir)
  }catch{
  }
}

function copyCoreFiles() {
  return fse.copySync(coreDir, tmpDir, { filter(src) {
    const splittedSrc = src.split("/")
    return ignoredDirs.indexOf(splittedSrc[splittedSrc.length-1]) > -1
  }});
}

function copyCustomSrcToCustomizations () {
  return fse.copySync(customSrcDir, customizationsDir);
}

function copyTheme () {
  fs.copyFile(themesFileDir, themeCustomizationsFileDir, (err) => {});
}

function mergeCMSFile (fileName) {

  const coreContentTypes = fs.readFileSync(`${CMSCoreDir}/${fileName}`, 'utf8')
  const customContentTypes = fs.readFileSync(`${CMSCustomDir}/${fileName}`, 'utf8')
  const coreContentTypesJSON = JSON.parse(coreContentTypes)
  const customContentTypesJSON = JSON.parse(customContentTypes)

  const mergeContentTypes = [...coreContentTypesJSON, ...customContentTypesJSON]


  fs.writeFile(`${CMSTmpDir}/${fileName}`, JSON.stringify(mergeContentTypes), () => {});
}

function copyStoreConfig() {
  fs.copyFile(storeConfigFileDir, storeConfigTmpFileDir, (err) => {});
}

function mergeCMSFiles () {
  try{
    fs.mkdirSync(`${tmpDir}/cms`)
  } catch {
  }

  mergeCMSFile("content-types.json")
  mergeCMSFile("sections.json")
}


function generate() {
  createTmpFolder()
  copyCoreFiles()
  copyCustomSrcToCustomizations()
  copyTheme()
  mergeCMSFiles()
  copyStoreConfig()
}

generate()
                                 
