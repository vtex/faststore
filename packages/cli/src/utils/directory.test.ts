import { beforeEach, describe, expect, it, vi } from 'vitest'
import path from 'path'
import { withBasePath } from './directory'

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
        // fileURLToPath(import.meta.resolve('@faststore/core', import.meta.url))
        require.resolve('@faststore/core')
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
          require.resolve('@faststore/core')
          // fileURLToPath(import.meta.resolve('@faststore/core', import.meta.url))
        )

        expect(pathsToMatch(coreDirWithBase, resolvedPath)).toBe(true)
      })
    })
  })

  describe('tmpDir', () => {
    it('is the basePath + .faststore (not cwd + .faststore)', () => {
      const { tmpDir: tmpDirWithBase } = withBasePath(basePath)

      expect(
        pathsToMatch(tmpDirWithBase, path.join(basePath, '.faststore'))
      ).toBe(true)
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
          path.join(basePath, '.faststore', 'src', 'customizations', 'src')
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
          path.join(
            basePath,
            '.faststore',
            'src',
            'customizations',
            'src',
            'themes',
            'index.scss'
          )
        )
      ).toBe(true)
    })
  })

  describe('tmpCMSDir', () => {
    it('returns the path of the CMS dir on the .faststore dir', () => {
      const { tmpCMSDir: tmpCMSDirWithBase } = withBasePath(basePath)

      expect(
        pathsToMatch(
          tmpCMSDirWithBase(),
          path.join(basePath, '.faststore', 'cms', 'faststore')
        )
      ).toBe(true)
    })

    it('returns the path of the CMS dir with the builderId on the .faststore dir', () => {
      const { tmpCMSDir: tmpCMSDirWithBase } = withBasePath(basePath)

      expect(
        pathsToMatch(
          tmpCMSDirWithBase('another-builder'),
          path.join(basePath, '.faststore', 'cms', 'another-builder')
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
          require.resolve('@faststore/core')
          // fileURLToPath(import.meta.resolve('@faststore/core', import.meta.url))
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
          path.join(basePath, '.faststore', 'cms-webhook-urls.json')
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
          path.join(
            basePath,
            '.faststore',
            'src',
            'customizations',
            'discovery.config.js'
          )
        )
      ).toBe(true)
    })
  })
})

describe('withBasePath as a monorepo package (e.g. root/packages/store)', () => {
  const monorepoRoot = path.join(__dirname, '..', '__mocks__', 'monorepo')
  const packagePath = path.join(monorepoRoot, 'store')

  it('places tmpDir under the package directory, not the monorepo root cwd', () => {
    process.cwd = vi.fn(() => monorepoRoot)

    const { tmpDir } = withBasePath(packagePath)
    const tmpDirIfOnlyCwd = path.join(monorepoRoot, '.faststore')

    expect(pathsToMatch(tmpDir, path.join(packagePath, '.faststore'))).toBe(
      true
    )
    expect(pathsToMatch(tmpDir, tmpDirIfOnlyCwd)).toBe(false)
  })

  it('resolves tmp paths under packagePath/.faststore when cwd is the repo root', () => {
    process.cwd = vi.fn(() => monorepoRoot)

    const paths = withBasePath(packagePath)

    expect(
      pathsToMatch(paths.tmpDir, path.join(packagePath, '.faststore'))
    ).toBe(true)
    expect(
      pathsToMatch(
        paths.tmpStoreConfigFile,
        path.join(
          packagePath,
          '.faststore',
          'src',
          'customizations',
          'discovery.config.js'
        )
      )
    ).toBe(true)
    expect(
      pathsToMatch(
        paths.tmpCMSDir(),
        path.join(packagePath, '.faststore', 'cms', 'faststore')
      )
    ).toBe(true)
    expect(
      pathsToMatch(
        paths.tmpCustomizationsSrcDir,
        path.join(packagePath, '.faststore', 'src', 'customizations', 'src')
      )
    ).toBe(true)
  })

  it('keeps user-facing paths on the package root (discovery.config, src, cms)', () => {
    const paths = withBasePath(packagePath)

    expect(pathsToMatch(paths.userDir, packagePath)).toBe(true)
    expect(
      pathsToMatch(
        paths.userStoreConfigFile,
        path.join(packagePath, 'discovery.config.js')
      )
    ).toBe(true)
    expect(pathsToMatch(paths.userSrcDir, path.join(packagePath, 'src'))).toBe(
      true
    )
    expect(
      pathsToMatch(paths.userCMSDir, path.join(packagePath, 'cms', 'faststore'))
    ).toBe(true)
  })

  it('uses a nested package path like .../packages/discovery independent of cwd', () => {
    const nestedPackage = path.join(monorepoRoot, 'packages', 'discovery')
    process.cwd = vi.fn(() => monorepoRoot)

    const { tmpDir, userDir } = withBasePath(nestedPackage)

    expect(pathsToMatch(tmpDir, path.join(nestedPackage, '.faststore'))).toBe(
      true
    )
    expect(pathsToMatch(userDir, nestedPackage)).toBe(true)
  })
})
