import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const runCommandSyncMock = vi.hoisted(() => vi.fn())

vi.mock('./runCommandSync', () => ({
  runCommandSync: (...args: unknown[]) => runCommandSyncMock(...args),
}))

import {
  errorNoCustomization,
  generateAndUploadSchema,
  getCpSchemaOutputPath,
  getExistingCpDirs,
} from './cp-schema'
import { logger } from './logger'

describe('cp-schema', () => {
  let tempDir: string
  let exitMock: ReturnType<typeof vi.spyOn>
  let errorMock: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'faststore-cp-schema-'))
    runCommandSyncMock.mockClear()
    exitMock = vi.spyOn(process, 'exit').mockImplementation((() => {}) as never)
    errorMock = vi.spyOn(logger, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true })
    exitMock.mockRestore()
    errorMock.mockRestore()
  })

  describe('getExistingCpDirs', () => {
    it('returns relative paths for existing customization dirs', () => {
      fs.mkdirSync(path.join(tempDir, 'cms', 'faststore', 'components'), {
        recursive: true,
      })

      expect(getExistingCpDirs(tempDir)).toEqual(['cms/faststore/components'])
    })

    it('returns both dirs when both exist', () => {
      fs.mkdirSync(path.join(tempDir, 'cms', 'faststore', 'components'), {
        recursive: true,
      })
      fs.mkdirSync(path.join(tempDir, 'cms', 'faststore', 'pages'), {
        recursive: true,
      })

      expect(getExistingCpDirs(tempDir)).toEqual([
        'cms/faststore/components',
        'cms/faststore/pages',
      ])
    })

    it('returns empty array when neither dir exists', () => {
      expect(getExistingCpDirs(tempDir)).toEqual([])
    })
  })

  describe('getCpSchemaOutputPath', () => {
    it('points to cms/faststore/schema.json under the store root', () => {
      expect(getCpSchemaOutputPath(tempDir)).toBe(
        path.join(tempDir, 'cms', 'faststore', 'schema.json')
      )
    })
  })

  describe('errorNoCustomization', () => {
    it('logs and exits with code 1', () => {
      errorNoCustomization()

      expect(errorMock).toHaveBeenCalledWith(
        expect.stringContaining('No CMS customization found')
      )
      expect(exitMock).toHaveBeenCalledWith(1)
    })
  })

  describe('generateAndUploadSchema', () => {
    it('runs generate then upload synchronously without -l', () => {
      const schemaOut = path.join(tempDir, 'cms', 'faststore', 'schema.json')

      generateAndUploadSchema({
        basePath: tempDir,
        dirs: ['cms/faststore/components', 'cms/faststore/pages'],
        schemaOut,
        dryRun: false,
      })

      expect(runCommandSyncMock).toHaveBeenCalledTimes(2)
      expect(runCommandSyncMock.mock.calls[0][0]).toEqual({
        cmd: `vtex content generate-schema cms/faststore/components cms/faststore/pages -o ${schemaOut}`,
        cwd: tempDir,
        throws: 'error',
        errorMessage: 'Failed to generate CMS schema',
      })
      expect(runCommandSyncMock.mock.calls[1][0]).toEqual({
        cmd: `vtex content upload-schema ${schemaOut}`,
        cwd: tempDir,
        throws: 'error',
        errorMessage: 'Failed to upload CMS schema',
      })
      expect(runCommandSyncMock.mock.calls[0][0].cmd).not.toContain('-l')
    })

    it('skips upload on dry-run', () => {
      generateAndUploadSchema({
        basePath: tempDir,
        dirs: ['cms/faststore/pages'],
        schemaOut: path.join(tempDir, 'cms', 'faststore', 'schema.json'),
        dryRun: true,
      })

      expect(runCommandSyncMock).toHaveBeenCalledTimes(1)
      expect(runCommandSyncMock.mock.calls[0][0].cmd).toContain(
        'generate-schema'
      )
    })
  })
})
