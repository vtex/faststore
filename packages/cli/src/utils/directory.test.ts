import path from "path"
import { withBasePath } from "./directory"

const pathsToMatch = (expected: string, desired: string) => {
  const expectedResolved = path.resolve(expected)
  const desiredResolved = path.resolve(desired)

  return expectedResolved === desiredResolved
}

describe('withBasePath as the current dir `.`', () => {
  const basePath = '.'

  describe('tmpDir', () => {
    it('is the basePath + .faststore', () => {
      const { tmpDir: tmpDirWithBase } = withBasePath(basePath)

      expect(pathsToMatch(tmpDirWithBase, './.faststore')).toBe(true)
    })
  })

  describe('userDir', () => {
    it("returns the directory of the starter's package.json", () => {
      const { userSrcDir: userSrcDirWithBase } = withBasePath(basePath)

      expect(pathsToMatch(userSrcDirWithBase, './src')).toBe(true)
    })
  })

  describe('tmpCustomizationsSrcDir', () => {
    it('returns the directory of customizations directory on the tmp dir', () => {
      const { tmpCustomizationsSrcDir: tmpCustomizationsSrcDirWithBase } = withBasePath(basePath)

      expect(pathsToMatch(tmpCustomizationsSrcDirWithBase, './.faststore/src/customizations/src')).toBe(true)
    })
  })

  describe('userThemesFileDir', () => {
    it("returns the directory of the starter's theme directory", () => {
      const { userThemesFileDir: userThemesFileDirWithBase } = withBasePath(basePath)

      expect(pathsToMatch(userThemesFileDirWithBase, './src/themes')).toBe(true)
    })
  })

  describe('tmpThemesCustomizationsFile', () => {
    it('returns the path of the theme file on the .faststore dir', () => {
      const { tmpThemesCustomizationsFile: tmpThemesCustomizationsFileWithBase } = withBasePath(basePath)

      expect(pathsToMatch(tmpThemesCustomizationsFileWithBase, './.faststore/src/customizations/src/themes/index.scss')).toBe(true)
    })
  })

  describe('tmpCMSDir', () => {
    it('returns the path of the CMS dir on the .faststore dir', () => {
      const { tmpCMSDir: tmpCMSDirWithBase } = withBasePath(basePath)

      expect(pathsToMatch(tmpCMSDirWithBase, './.faststore/cms/faststore')).toBe(true)
    })
  })

  describe('userCMSDir', () => {
    it('returns the path of the CMS dir on the user dir', () => {
      const { userCMSDir: userCMSDirWithBase } = withBasePath(basePath)

      expect(pathsToMatch(userCMSDirWithBase, './cms/faststore')).toBe(true)
    })
  })

  describe('tmpCMSWebhookUrlsFile', () => {
    it('returns the path of the CMS webhooks file on the .faststore dir', () => {
      const { tmpCMSWebhookUrlsFile: tmpCMSWebhookUrlsFileWithBase } = withBasePath(basePath)

      expect(pathsToMatch(tmpCMSWebhookUrlsFileWithBase, './.faststore/cms-webhook-urls.json')).toBe(true)
    })
  })

  describe('userStoreConfigFile', () => {
    it('returns the path of the user faststore.config file', () => {
      const { userStoreConfigFile: userStoreConfigFileWithBase } = withBasePath(basePath)

      expect(pathsToMatch(userStoreConfigFileWithBase, './faststore.config.js')).toBe(true)
    })
  })

  describe('tmpStoreConfigFile', () => {
    it('returns the path of the faststore.config file in the customizations dir', () => {
      const { tmpStoreConfigFile: tmpStoreConfigFileWithBase } = withBasePath(basePath)

      expect(pathsToMatch(tmpStoreConfigFileWithBase, './.faststore/src/customizations/faststore.config.js')).toBe(true)
    })
  })
})

describe('withBasePath as an arbitrary dir', () => {
  const basePath = path.join(__dirname, '..', '__mocks__', 'store')

  describe('coreDir', () => {
    it('is the faststoreDir + core', () => {
      const { coreDir: coreDirWithBase } = withBasePath(basePath)

      expect(pathsToMatch(coreDirWithBase, './src/__mocks__/store/node_modules/@faststore/core')).toBe(true)
    })

    describe('when is in a monorepo', () => {
      it('can look at its parent until it reaches the monorepo directory', () => {
        const { coreDir: coreDirWithBase } = withBasePath(path.join(__dirname, '..', '__mocks__', 'monorepo', 'discovery'))

        expect(pathsToMatch(coreDirWithBase, './src/__mocks__/monorepo/node_modules/@faststore/core')).toBe(true)
      })
    })
  })

  describe('tmpDir', () => {
    it('is the basePath + .faststore', () => {
      const { tmpDir: tmpDirWithBase } = withBasePath(basePath)

      expect(pathsToMatch(tmpDirWithBase, './src/__mocks__/store/.faststore')).toBe(true)
    })
  })

  describe('userDir', () => {
    it("returns the directory of the starter's package.json", () => {
      const { userSrcDir: userSrcDirWithBase } = withBasePath(basePath)

      expect(pathsToMatch(userSrcDirWithBase, './src/__mocks__/store/src')).toBe(true)
    })
  })

  describe('tmpCustomizationsSrcDir', () => {
    it('returns the directory of customizations directory on the tmp dir', () => {
      const { tmpCustomizationsSrcDir: tmpCustomizationsSrcDirWithBase } = withBasePath(basePath)

      expect(pathsToMatch(tmpCustomizationsSrcDirWithBase, './src/__mocks__/store/.faststore/src/customizations/src')).toBe(true)
    })
  })

  describe('userThemesFileDir', () => {
    it("returns the directory of the starter's theme directory", () => {
      const { userThemesFileDir: userThemesFileDirWithBase } = withBasePath(basePath)

      expect(pathsToMatch(userThemesFileDirWithBase, './src/__mocks__/store/src/themes')).toBe(true)
    })
  })

  describe('tmpThemesCustomizationsFile', () => {
    it('returns the path of the theme file on the .faststore dir', () => {
      const { tmpThemesCustomizationsFile: tmpThemesCustomizationsFileWithBase } = withBasePath(basePath)

      expect(pathsToMatch(tmpThemesCustomizationsFileWithBase, './src/__mocks__/store/.faststore/src/customizations/src/themes/index.scss')).toBe(true)
    })
  })

  describe('tmpCMSDir', () => {
    it('returns the path of the CMS dir on the .faststore dir', () => {
      const { tmpCMSDir: tmpCMSDirWithBase } = withBasePath(basePath)

      expect(pathsToMatch(tmpCMSDirWithBase, './src/__mocks__/store/.faststore/cms/faststore')).toBe(true)
    })
  })

  describe('userCMSDir', () => {
    it('returns the path of the CMS dir on the user dir', () => {
      const { userCMSDir: userCMSDirWithBase } = withBasePath(basePath)

      expect(pathsToMatch(userCMSDirWithBase, './src/__mocks__/store/cms/faststore')).toBe(true)
    })
  })

  describe('coreCMSDir', () => {
    it('returns the path of the CMS dir on @faststore/core package', () => {
      const { coreCMSDir: coreCMSDirWithBase } = withBasePath(basePath)

      expect(pathsToMatch(coreCMSDirWithBase, './src/__mocks__/store/node_modules/@faststore/core/cms/faststore')).toBe(true)
    })
  })

  describe('tmpCMSWebhookUrlsFile', () => {
    it('returns the path of the CMS webhooks file on the .faststore dir', () => {
      const { tmpCMSWebhookUrlsFile: tmpCMSWebhookUrlsFileWithBase } = withBasePath(basePath)

      expect(pathsToMatch(tmpCMSWebhookUrlsFileWithBase, './src/__mocks__/store/.faststore/cms-webhook-urls.json')).toBe(true)
    })
  })

  describe('userStoreConfigFile', () => {
    it('returns the path of the user faststore.config file', () => {
      const { userStoreConfigFile: userStoreConfigFileWithBase } = withBasePath(basePath)

      expect(pathsToMatch(userStoreConfigFileWithBase, './src/__mocks__/store/faststore.config.js')).toBe(true)
    })
  })

  describe('tmpStoreConfigFile', () => {
    it('returns the path of the faststore.config file in the customizations dir', () => {
      const { tmpStoreConfigFile: tmpStoreConfigFileWithBase } = withBasePath(basePath)

      expect(pathsToMatch(tmpStoreConfigFileWithBase, './src/__mocks__/store/.faststore/src/customizations/faststore.config.js')).toBe(true)
    })
  })
})
