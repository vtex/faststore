import fs from 'fs'
import path from 'path'

import type { PluginOptionsSchemaArgs, BuildArgs } from 'gatsby'

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
  Joi.object({
    oneSignalAppId: Joi.string().required(),
    pathToOneSignalFiles: Joi.string().optional,
    mainSWFileName: Joi.string().optional,
    updaterSWFileName: Joi.string().optional,
    SWRegistrationScope: Joi.string().optional,
  })

export type PluginOptions = {
  plugins: unknown[]
  oneSignalAppId: string
  pathToOneSignalFiles?: string
  mainSWFileName?: string
  updaterSWFileName?: string
  SWRegistrationScope?: string
}

const OneSignalSDKUpdaterWorker = `importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');`

const OneSignalSDKWorker = `importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');`

exports.onPostBuild = async (_: BuildArgs, pluginOptions: PluginOptions) => {
  const {
    pathToOneSignalFiles = 'push/onesignal',
    mainSWFileName = 'onesignalsdkworker.js',
    updaterSWFileName = 'onesignalsdkupdaterworker.js',
  } = pluginOptions

  const publicFolderPath = `${process.cwd()}/public`
  const oneSignalFilesPath = path.join(publicFolderPath, pathToOneSignalFiles)

  await fs.promises.mkdir(oneSignalFilesPath, { recursive: true })

  const mainFilePath = path.join(oneSignalFilesPath, mainSWFileName)
  const updaterFilePath = path.join(oneSignalFilesPath, updaterSWFileName)

  // OneSignalSDKWorker
  fs.writeFileSync(mainFilePath, OneSignalSDKWorker)

  // OneSignalSDKUpdaterWorker
  fs.writeFileSync(updaterFilePath, OneSignalSDKUpdaterWorker)
}
