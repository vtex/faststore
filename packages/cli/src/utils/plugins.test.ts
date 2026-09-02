import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { copyPluginsSrc } from './plugins'

describe('copyPluginsSrc', () => {
  let basePath: string

  const pluginSrc = () =>
    path.join(basePath, 'node_modules', '@acme', 'demo-plugin', 'src')
  const destDir = () =>
    path.join(basePath, '.faststore', 'src', 'plugins', 'demo-plugin')

  beforeEach(() => {
    basePath = fs.mkdtempSync(path.join(os.tmpdir(), 'faststore-plugin-copy-'))
    fs.mkdirSync(pluginSrc(), { recursive: true })
    fs.mkdirSync(path.join(pluginSrc(), '__tests__'), { recursive: true })
    fs.mkdirSync(path.join(basePath, '.faststore', 'src', 'plugins'), {
      recursive: true,
    })
    fs.writeFileSync(path.join(pluginSrc(), 'index.ts'), 'export default {}')
    fs.writeFileSync(path.join(pluginSrc(), 'widget.test.ts'), 'test')
    fs.writeFileSync(path.join(pluginSrc(), '__tests__', 'extra.ts'), 'test')
  })

  afterEach(() => {
    fs.rmSync(basePath, { recursive: true, force: true })
  })

  it('copies plugin src but skips __tests__ folders and colocated test files', async () => {
    await copyPluginsSrc(basePath, ['@acme/demo-plugin'])

    expect(fs.existsSync(path.join(destDir(), 'index.ts'))).toBe(true)
    expect(fs.existsSync(path.join(destDir(), 'widget.test.ts'))).toBe(false)
    expect(fs.existsSync(path.join(destDir(), '__tests__'))).toBe(false)
  })
})
