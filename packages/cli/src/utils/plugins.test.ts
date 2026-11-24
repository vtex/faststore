import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import ts from 'typescript'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { copyPluginsSrc, getPluginPageFileContent } from './plugins'

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

const generate = (appLayout: boolean) =>
  getPluginPageFileContent('my-plugin', 'my-page', appLayout)

const transpile = (source: string) =>
  ts.transpileModule(source, {
    reportDiagnostics: true,
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext,
    },
  })

describe('getPluginPageFileContent', () => {
  describe('with appLayout', () => {
    const content = generate(true)

    it('resolves the three global sections promises and merges them', () => {
      // `getGlobalSectionsData` returns [globalSections, header, footer]
      // promises; destructuring `{ sections }` from that array is always empty.
      expect(content).toContain('getGlobalSectionsData({ previewData')
      expect(content).toContain('Promise.all')
      expect(content).toContain('injectGlobalSections')
      expect(content).not.toContain(
        'const { sections = [] } = await getGlobalSectionsData'
      )
    })

    it('passes the global sections and settings as page props', () => {
      expect(content).toContain('globalSections: sections')
      expect(content).toContain('globalSettings')
    })

    it('wraps the page in the PageProvider the global sections need', () => {
      expect(content).toContain(
        "import PageProvider from 'src/sdk/overrides/PageProvider'"
      )
      expect(content).toContain(
        '<PageProvider context={{ globalSettings: props.globalSettings }}>'
      )
      expect(content).toContain(
        '<RenderSections globalSections={props.globalSections}>'
      )
    })

    it('generates syntactically valid code', () => {
      expect(transpile(content).diagnostics).toEqual([])
    })
  })

  describe('without appLayout', () => {
    const content = generate(false)

    it('does not load or render global sections', () => {
      expect(content).not.toContain('getGlobalSectionsData')
      expect(content).not.toContain('injectGlobalSections')
      expect(content).not.toContain('PageProvider')
      expect(content).not.toContain('RenderSections')
    })

    it('renders the page directly', () => {
      expect(content).toContain('return page.default(props.data)')
    })

    it('generates syntactically valid code', () => {
      expect(transpile(content).diagnostics).toEqual([])
    })
  })
})
