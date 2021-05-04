import fs from 'fs'
import path from 'path'

import type { PluginOptionsSchemaArgs, BuildArgs } from 'gatsby'

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
  Joi.object({
    oneSignalAppId: Joi.string()
      .required()
      .description("Your site's appId, provided by OneSignal."),
    pathToOneSignalFiles: Joi.string().description(
      "This should match the 'Path to service worker files' option found in the advanced section of your site's OneSignal admin panel. In most cases this should also match the 'Service worker registration scope' option."
    ),
    mainSWFileName: Joi.string().description(
      "This should match the 'Main service worker filename' option found in the advanced section of your site's OneSignal admin panel."
    ),
    updaterSWFileName: Joi.string().description(
      "This should match the 'Updater service worker filename' option found in the advanced section of your site's OneSignal admin panel."
    ),
  })

export type PluginOptions = {
  oneSignalAppId: string
  pathToOneSignalFiles?: string
  mainSWFileName?: string
  updaterSWFileName?: string
  // This property is added by Gatsby and is not a part of this plugin's API
  plugins: unknown[]
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

  fs.writeFileSync(mainFilePath, OneSignalSDKWorker)

  fs.writeFileSync(updaterFilePath, OneSignalSDKUpdaterWorker)
}
