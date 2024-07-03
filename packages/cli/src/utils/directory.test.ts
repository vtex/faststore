import path from "path"
import { coreCMSDir, coreDir, tmpCMSDir, tmpCMSWebhookUrlsFile, tmpCustomizationsSrcDir, tmpDir, tmpStoreConfigFile, tmpThemesCustomizationsFile, userCMSDir, userSrcDir, userStoreConfigFile, userThemesFileDir, withBasePath } from "./directory"

const pathsToMatch = (expected: string, desired: string) => {
  const expectedResolved = path.resolve(expected)
  const desiredResolved = path.resolve(desired)

  return expectedResolved === desiredResolved
}

describe('directory with base path', () => {
  describe('coreDir', () => {
    it('is the fastsstoreDir + core', () => {
      expect(pathsToMatch(coreDir, './node_modules/@faststore/core')).toBe(true)
    })
  })

  describe('tmpDir', () => {
    it('is the cwd + .faststore', () => {
      expect(pathsToMatch(tmpDir, './.faststore')).toBe(true)
    })
  })

  describe('userDir', () => {
    it('returns the directory of the starters package.json', () => {
      expect(pathsToMatch(userSrcDir, './src')).toBe(true)
    })
  })

  describe('tmpCustomizationsSrcDir', () => {
    it('returns the directory of customizations directory on the tmp dir', () => {
      expect(pathsToMatch(tmpCustomizationsSrcDir, './.faststore/src/customizations/src')).toBe(true)
    })
  })

  describe('userThemesFileDir', () => {
    it('returns the directory of the starters package.json', () => {
      expect(pathsToMatch(userThemesFileDir, './src/themes')).toBe(true)
    })
  })

  describe('tmpThemesCustomizationsFile', () => {
    it('returns the path of the theme file on the .faststore dir', () => {
      expect(pathsToMatch(tmpThemesCustomizationsFile, './.faststore/src/customizations/src/themes/index.scss')).toBe(true)
    })
  })

  describe('tmpCMSDir', () => {
    it('returns the path of the CMS dir on the .faststore dir', () => {
      expect(pathsToMatch(tmpCMSDir, './.faststore/cms/faststore')).toBe(true)
    })
  })

  describe('userCMSDir', () => {
    it('returns the path of the CMS dir on the user dir', () => {
      expect(pathsToMatch(userCMSDir, './cms/faststore')).toBe(true)
    })
  })

  describe('coreCMSDir', () => {
    it('returns the path of the CMS dir on @faststore/core package', () => {
      expect(pathsToMatch(coreCMSDir, './node_modules/@faststore/core/cms/faststore')).toBe(true)
    })
  })

  describe('tmpCMSWebhookUrlsFile', () => {
    it('returns the path of the CMS webhooks file on the .faststore dir', () => {
      expect(pathsToMatch(tmpCMSWebhookUrlsFile, './.faststore/cms-webhook-urls.json')).toBe(true)
    })
  })

  describe('userStoreConfigFile', () => {
    it('returns the path of the user faststore.config file', () => {
      expect(pathsToMatch(userStoreConfigFile, './faststore.config.js')).toBe(true)
    })
  })

  describe('tmpStoreConfigFile', () => {
    it('returns the path of the faststore.config file in the customizations dir', () => {
      expect(pathsToMatch(tmpStoreConfigFile, './.faststore/src/customizations/faststore.config.js')).toBe(true)
    })
  })
})

