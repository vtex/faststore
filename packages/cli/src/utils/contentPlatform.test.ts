import type { Dirent } from 'fs-extra'
import fse from 'fs-extra'
import {
  listFilesRecursive,
  groupCustomComponentDefinitions,
  // groupCustomContentTypeDefinitions,
  // addAllowAllComponentsDefToSchema,
  // generateFullSchema,
} from './contentPlatform'
import chalk from 'chalk'

const mockDirent = (name: string, isDir: boolean): Dirent =>
  ({
    name,
    isDirectory: () => isDir,
    isFile: () => !isDir,
    isBlockDevice: () => false,
    isCharacterDevice: () => false,
    isSymbolicLink: () => false,
    isFIFO: () => false,
    isSocket: () => false,
  }) as Dirent

/**
 * This mock implementation is simulating a file system structure that looks
 * like this:
 * - /dir1
 *   - /dir2
 *     - /dir3
 *       - file2.txt
 *       - cp_schema1.json
 *       - cp_schema2.json
 *       - cp_schema3.json
 *   - file.txt
 */
jest.mock('fs-extra', () => ({
  readFileSync: jest.fn(),
  readdir: jest.fn().mockImplementation((path: string): Promise<Dirent[]> => {
    if (path === './dir1') {
      return Promise.resolve([
        mockDirent('dir2', true),
        mockDirent('file.txt', false),
      ])
    }

    if (path === './dir1/dir2') {
      return Promise.resolve([mockDirent('dir3', true)])
    }

    if (path === './dir1/dir2/dir3') {
      return Promise.resolve([
        mockDirent('file2.txt', false),
        mockDirent('cp_schema1.json', false),
        mockDirent('cp_schema2.json', false),
        mockDirent('cp_schema3.json', false),
      ])
    }

    return Promise.resolve([])
  }),
  stat: jest.fn().mockImplementation((path: string) => {
    const dirPaths = ['./dir1', './dir1/dir2', './dir1/dir2/dir3']
    const filePaths = [
      './dir1/file.txt',
      './dir1/dir2/dir3/file2.txt',
      './dir1/dir2/dir3/cp_schema1.json',
      './dir1/dir2/dir3/cp_schema2.json',
      './dir1/dir2/dir3/cp_schema3.json',
    ]

    if (dirPaths.includes(path)) {
      return Promise.resolve({
        isFile: jest.fn().mockReturnValue(false),
        isDirectory: jest.fn().mockReturnValue(true),
      })
    }

    if (filePaths.includes(path)) {
      return Promise.resolve({ isFile: jest.fn().mockReturnValue(true) })
    }

    return Promise.resolve({ isFile: jest.fn().mockReturnValue(false) })
  }),
}))

const mockedFs = fse as jest.Mocked<typeof fse>

// This is just to make it easier to match paths inside the tests
jest.mock('path', () => ({
  ...jest.requireActual('path'),
  resolve: jest.fn((...args: string[]) => args.join('/')),
}))

describe('listFilesRecursive', () => {
  it('should return the file path in an array if basePath is a file matching pattern', () => {
    const basePath = 'test/test2/test3/file.json'
    const matchPattern = /\.json$/

    mockedFs.stat.mockResolvedValueOnce({
      isFile: jest.fn().mockReturnValue(true),
    } as any)

    return listFilesRecursive(basePath, matchPattern).then((result) => {
      expect(result).toEqual([basePath])
      expect(mockedFs.stat).toHaveBeenCalledWith(basePath)
      expect(mockedFs.readdir).not.toHaveBeenCalled()
    })
  })

  it('should return an empty array if basePath is a file not matching pattern', () => {
    const basePath = 'test/test2/test3/file.txt'
    const matchPattern = /\.json$/

    mockedFs.stat.mockResolvedValueOnce({
      isFile: jest.fn().mockReturnValue(true),
    } as any)

    return listFilesRecursive(basePath, matchPattern).then((result) => {
      expect(result).toEqual([])
      expect(mockedFs.stat).toHaveBeenCalledWith(basePath)
      expect(mockedFs.readdir).not.toHaveBeenCalled()
    })
  })

  it('should return an empty array if basePath has no matching files', () => {
    const basePath = './dir1'
    const matchPattern = /\.ts/

    return listFilesRecursive(basePath, matchPattern).then((result) => {
      expect(result).toEqual([])
    })
  })

  it('should return all matching files if basePath has matching files in any depth', () => {
    const basePath = './dir1'

    let matchPattern = /\.json$/
    listFilesRecursive(basePath, matchPattern).then((result) => {
      expect(result).toContain('./dir1/dir2/dir3/cp_schema1.json')
      expect(result).toContain('./dir1/dir2/dir3/cp_schema2.json')
      expect(result).toContain('./dir1/dir2/dir3/cp_schema3.json')
      expect(result).toHaveLength(3)
    })

    matchPattern = /\.txt$/
    listFilesRecursive(basePath, matchPattern).then((result) => {
      expect(result).toContain('./dir1/dir2/dir3/file2.txt')
      expect(result).toContain('./dir1/file.txt')
      expect(result).toHaveLength(2)
    })
  })
})

describe('groupCustomComponentDefinitions', () => {
  const consoleSpy = jest.spyOn(console, 'info')
  beforeEach(() => {
    mockedFs.readFileSync.mockClear()
    consoleSpy.mockClear()
  })

  it('should group valid custom component definitions using $componentKey as index', () => {
    const schema1 = {
      $componentKey: 'component1Key',
      title: 'Component 1',
      properties: {
        sections: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              content: { type: 'string' },
            },
          },
        },
      },
    }
    const schema2 = {
      $componentKey: 'component2Key',
      title: 'Component 2',
      properties: {
        sections: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              imageSrc: { type: 'string' },
              description: { type: 'string' },
            },
          },
        },
      },
    }
    const schema3 = {
      $componentKey: 'component3',
      title: 'Component 3',
      properties: {
        sections: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              height: { type: 'number' },
              width: { type: 'number' },
            },
          },
        },
      },
    }

    mockedFs.readFileSync
      .mockReturnValueOnce(JSON.stringify(schema1))
      .mockReturnValueOnce(JSON.stringify(schema2))
      .mockReturnValueOnce(JSON.stringify(schema3))

    const schemaFiles = [
      './dir1/dir2/dir3/cp_schema1.json',
      './dir1/dir2/dir3/cp_schema2.json',
      './dir1/dir2/dir3/cp_schema3.json',
    ]

    const result = groupCustomComponentDefinitions(schemaFiles)

    expect(result).toEqual({
      component1Key: schema1,
      component2Key: schema2,
      component3: schema3,
    })
    expect(mockedFs.readFileSync).toHaveBeenCalledTimes(3)
  })

  it('should return empty object when no schema files are provided', () => {
    const result = groupCustomComponentDefinitions([])

    expect(result).toEqual({})
    expect(mockedFs.readFileSync).not.toHaveBeenCalled()
  })

  it('should log when JSON file is malformed, ignore it and not throw', () => {
    mockedFs.readFileSync.mockReturnValueOnce('invalid json')

    const result = groupCustomComponentDefinitions(['./malformed.json'])

    expect(consoleSpy).toHaveBeenCalledWith(
      // The use of chalk.red is needed here, otherwise this won't match.
      `${chalk.red(
        'error'
      )} - ./malformed.json is a malformed JSON file, ignoring its content.`
    )
    expect(consoleSpy).toHaveBeenCalledTimes(1)
    expect(result).toEqual({})
  })

  it('should skip files missing required $componentKey property, letting the user know', () => {
    const schema1 = { title: 'Component 1' }
    const schema2 = { $componentKey: 'component2', title: 'Component 2' }
    const schema3 = { $componentKey: 'component3', title: 'Component 3' }

    mockedFs.readFileSync
      .mockReturnValueOnce(JSON.stringify(schema1))
      .mockReturnValueOnce(JSON.stringify(schema2))
      .mockReturnValueOnce(JSON.stringify(schema3))

    const schemaFiles = [
      './dir1/dir2/dir3/cp_schema1.json',
      './dir1/dir2/dir3/cp_schema2.json',
      './dir1/dir2/dir3/cp_schema3.json',
    ]

    const result = groupCustomComponentDefinitions(schemaFiles)

    expect(mockedFs.readFileSync).toHaveBeenCalledTimes(3)

    expect(consoleSpy).toHaveBeenCalledWith(
      // The use of chalk.red is needed here, otherwise this won't match.
      `${chalk.red(
        'error'
      )} - ./dir1/dir2/dir3/cp_schema1.json is missing the $componentKey property. Ignoring it.`
    )
    expect(consoleSpy).toHaveBeenCalledTimes(1)

    expect(result).toEqual({
      component2: schema2,
      component3: schema3,
    })
  })

  it('should use the last definition when duplicate component keys are encountered and also let the user know', () => {
    const schema1 = { $componentKey: 'duplicate', title: 'First Definition' }
    const schema2 = { $componentKey: 'duplicate', title: 'Second Definition' }

    mockedFs.readFileSync
      .mockReturnValueOnce(JSON.stringify(schema1))
      .mockReturnValueOnce(JSON.stringify(schema2))

    const schemaFiles = [
      './dir1/dir2/dir3/cp_schema1.json',
      './dir1/dir2/dir3/cp_schema2.json',
    ]

    const result = groupCustomComponentDefinitions(schemaFiles)

    expect(consoleSpy).toHaveBeenCalledWith(
      // The use of chalk.red is needed here, otherwise this won't match.
      `${chalk.red(
        'info'
      )} - The component key duplicate is being used more than once.\nThis can lead to unexpected behavior, please check your component schemas.\nUsing the last definition found for this key, from: ./dir1/dir2/dir3/cp_schema2.json`
    )
    expect(consoleSpy).toHaveBeenCalledTimes(1)

    // Last definition wins
    expect(result).toEqual({ duplicate: schema2 })
    expect(mockedFs.readFileSync).toHaveBeenCalledTimes(2)
  })
})

describe('groupCustomContentTypeDefinitions', () => {})

describe('addAllowAllComponentsDefToSchema', () => {
  it.todo(
    'should add $ALLOW_ALL_COMPONENTS under $defs property and not overwrite existing definitions'
  )

  it.todo(
    'should generate $ALLOW_ALL_COMPONENTS that includes all components in the schema'
  )

  it.todo(
    'should add an empty $ALLOW_ALL_COMPONENTS definition if the schema has no components'
  )
})

describe('generateFullSchema', () => {
  it.todo(
    'should generate a full schema with all expected definitions from original and custom schemas'
  )
})
