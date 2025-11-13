import { beforeEach, describe, expect, it, vi } from 'vitest'
import path from 'path'
import { withBasePath } from './directory'
import { fileURLToPath } from 'url'

const pathsToMatch = (expected: string, desired: string) => {
  const expectedResolved = path.resolve(expected)
  const desiredResolved = path.resolve(desired)

  return expectedResolved === desiredResolved
}

const originalProcessCwd = process.cwd

beforeEach(() => {
  process.cwd = originalProcessCwd
})

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
      const { tmpCustomizationsSrcDir: tmpCustomizationsSrcDirWithBase } =
        withBasePath(basePath)

      expect(
        pathsToMatch(
          tmpCustomizationsSrcDirWithBase,
          './.faststore/src/customizations/src'
        )
      ).toBe(true)
    })
  })

  describe('userThemesFileDir', () => {
    it("returns the directory of the starter's theme directory", () => {
      const { userThemesFileDir: userThemesFileDirWithBase } =
        withBasePath(basePath)

      expect(pathsToMatch(userThemesFileDirWithBase, './src/themes')).toBe(true)
    })
  })

  describe('tmpThemesCustomizationsFile', () => {
    it('returns the path of the theme file on the .faststore dir', () => {
      const {
        tmpThemesCustomizationsFile: tmpThemesCustomizationsFileWithBase,
      } = withBasePath(basePath)

      expect(
        pathsToMatch(
          tmpThemesCustomizationsFileWithBase,
          './.faststore/src/customizations/src/themes/index.scss'
        )
      ).toBe(true)
    })
  })

  describe('tmpCMSDir', () => {
    it('returns the path of the CMS dir on the .faststore dir', () => {
      const { tmpCMSDir: tmpCMSDirWithBase } = withBasePath(basePath)

      expect(
        pathsToMatch(tmpCMSDirWithBase(), './.faststore/cms/faststore')
      ).toBe(true)
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
      const { tmpCMSWebhookUrlsFile: tmpCMSWebhookUrlsFileWithBase } =
        withBasePath(basePath)

      expect(
        pathsToMatch(
          tmpCMSWebhookUrlsFileWithBase,
          './.faststore/cms-webhook-urls.json'
        )
      ).toBe(true)
    })
  })

  describe('userStoreConfigFile', () => {
    it('returns the path of the user discovery.config file', () => {
      const { userStoreConfigFile: userStoreConfigFileWithBase } =
        withBasePath(basePath)

      expect(
        pathsToMatch(userStoreConfigFileWithBase, './discovery.config.js')
      ).toBe(true)
    })
  })

  describe('tmpStoreConfigFile', () => {
    it('returns the path of the discovery.config file in the customizations dir', () => {
      const { tmpStoreConfigFile: tmpStoreConfigFileWithBase } =
        withBasePath(basePath)

      expect(
        pathsToMatch(
          tmpStoreConfigFileWithBase,
          './.faststore/src/customizations/discovery.config.js'
        )
      ).toBe(true)
    })
  })
})

describe('withBasePath as an arbitrary dir', () => {
  const basePath = path.join(__dirname, '..', '__mocks__', 'store')

  describe('coreDir', () => {
    it('is the faststoreDir + core', () => {
      const mockedCwd = vi.fn(() => {
        return './src/__mocks__/store'
      })
      process.cwd = mockedCwd
      const { coreDir: coreDirWithBase } = withBasePath(basePath)

      const resolvedPath = path.dirname(
        fileURLToPath(import.meta.resolve('@faststore/core', import.meta.url))
      )

      expect(pathsToMatch(coreDirWithBase, resolvedPath)).toBe(true)
    })

    describe('when is in a monorepo', () => {
      it('can look at its parent until it reaches the monorepo directory', () => {
        const mockedCwd = vi.fn(() => {
          return './src/__mocks__/monorepo'
        })
        process.cwd = mockedCwd

        const { coreDir: coreDirWithBase } = withBasePath(
          path.join(__dirname, '..', '__mocks__', 'monorepo', 'discovery')
        )

        const resolvedPath = path.dirname(
          fileURLToPath(import.meta.resolve('@faststore/core', import.meta.url))
        )

        expect(pathsToMatch(coreDirWithBase, resolvedPath)).toBe(true)
      })
    })
  })

  describe('tmpDir', () => {
    it('is the basePath + .faststore', () => {
      const { tmpDir: tmpDirWithBase } = withBasePath(basePath)

      expect(pathsToMatch(tmpDirWithBase, './.faststore')).toBe(true)
    })
  })

  describe('userDir', () => {
    it("returns the directory of the starter's package.json", () => {
      const { userSrcDir: userSrcDirWithBase } = withBasePath(basePath)

      expect(
        pathsToMatch(userSrcDirWithBase, './src/__mocks__/store/src')
      ).toBe(true)
    })
  })

  describe('tmpCustomizationsSrcDir', () => {
    it('returns the directory of customizations directory on the tmp dir', () => {
      const { tmpCustomizationsSrcDir: tmpCustomizationsSrcDirWithBase } =
        withBasePath(basePath)

      expect(
        pathsToMatch(
          tmpCustomizationsSrcDirWithBase,
          './.faststore/src/customizations/src'
        )
      ).toBe(true)
    })
  })

  describe('userThemesFileDir', () => {
    it("returns the directory of the starter's theme directory", () => {
      const { userThemesFileDir: userThemesFileDirWithBase } =
        withBasePath(basePath)

      expect(
        pathsToMatch(
          userThemesFileDirWithBase,
          './src/__mocks__/store/src/themes'
        )
      ).toBe(true)
    })
  })

  describe('tmpThemesCustomizationsFile', () => {
    it('returns the path of the theme file on the .faststore dir', () => {
      const {
        tmpThemesCustomizationsFile: tmpThemesCustomizationsFileWithBase,
      } = withBasePath(basePath)

      expect(
        pathsToMatch(
          tmpThemesCustomizationsFileWithBase,
          './.faststore/src/customizations/src/themes/index.scss'
        )
      ).toBe(true)
    })
  })

  describe('tmpCMSDir', () => {
    it('returns the path of the CMS dir on the .faststore dir', () => {
      const { tmpCMSDir: tmpCMSDirWithBase } = withBasePath(basePath)

      expect(
        pathsToMatch(tmpCMSDirWithBase(), './.faststore/cms/faststore')
      ).toBe(true)
    })

    it('returns the path of the CMS dir with the builderId on the .faststore dir', () => {
      const { tmpCMSDir: tmpCMSDirWithBase } = withBasePath(basePath)

      expect(
        pathsToMatch(
          tmpCMSDirWithBase('another-builder'),
          './.faststore/cms/another-builder'
        )
      ).toBe(true)
    })
  })

  describe('userCMSDir', () => {
    it('returns the path of the CMS dir on the user dir', () => {
      const { userCMSDir: userCMSDirWithBase } = withBasePath(basePath)

      expect(
        pathsToMatch(userCMSDirWithBase, './src/__mocks__/store/cms/faststore')
      ).toBe(true)
    })
  })

  describe('coreCMSDir', () => {
    it('returns the path of the CMS dir on @faststore/core package', () => {
      const mockedCwd = vi.fn(() => {
        return './src/__mocks__/store'
      })
      process.cwd = mockedCwd

      const { coreCMSDir: coreCMSDirWithBase } = withBasePath(basePath)

      const resolvedPath = path.join(
        path.dirname(
          fileURLToPath(import.meta.resolve('@faststore/core', import.meta.url))
        ),
        'cms',
        'faststore'
      )

      expect(pathsToMatch(coreCMSDirWithBase, resolvedPath)).toBe(true)
    })
  })

  describe('tmpCMSWebhookUrlsFile', () => {
    it('returns the path of the CMS webhooks file on the .faststore dir', () => {
      const { tmpCMSWebhookUrlsFile: tmpCMSWebhookUrlsFileWithBase } =
        withBasePath(basePath)

      expect(
        pathsToMatch(
          tmpCMSWebhookUrlsFileWithBase,
          './.faststore/cms-webhook-urls.json'
        )
      ).toBe(true)
    })
  })

  describe('userStoreConfigFile', () => {
    it('returns the path of the user discovery.config file', () => {
      const { userStoreConfigFile: userStoreConfigFileWithBase } =
        withBasePath(basePath)

      expect(
        pathsToMatch(
          userStoreConfigFileWithBase,
          './src/__mocks__/store/discovery.config.js'
        )
      ).toBe(true)
    })
  })

  describe('tmpStoreConfigFile', () => {
    it('returns the path of the discovery.config file in the customizations dir', () => {
      const { tmpStoreConfigFile: tmpStoreConfigFileWithBase } =
        withBasePath(basePath)

      expect(
        pathsToMatch(
          tmpStoreConfigFileWithBase,
          './.faststore/src/customizations/discovery.config.js'
        )
      ).toBe(true)
    })
  })
})
