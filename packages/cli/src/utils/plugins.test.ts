import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import ts from 'typescript'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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

type Element = {
  type: unknown
  props: Record<string, unknown>
  children: unknown[]
}

type Harness = {
  getServerSideProps: (context: Record<string, unknown>) => Promise<{
    props: Record<string, unknown>
  }>
  Page: (props: Record<string, unknown>) => unknown
  getGlobalSectionsData: ReturnType<typeof vi.fn>
  injectGlobalSections: ReturnType<typeof vi.fn>
  RenderSections: unknown
  PageProvider: unknown
}

// Transpiles the generated page and runs it against mocked `src/...` modules,
// so the tests check what the page does (arguments, props, element tree)
// instead of which substrings the template contains.
const loadGeneratedPage = (
  appLayout: boolean,
  options: { injectResult?: unknown; injectError?: Error } = {}
): Harness => {
  const source = getPluginPageFileContent('my-plugin', 'my-page', appLayout)
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      jsx: ts.JsxEmit.React,
      jsxFactory: 'h',
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  })

  // `getGlobalSectionsData` returns [globalSections, header, footer] promises.
  const getGlobalSectionsData = vi.fn(() => [
    Promise.resolve('GLOBAL'),
    Promise.resolve('HEADER'),
    Promise.resolve('FOOTER'),
  ])
  const injectGlobalSections = vi.fn(() => {
    if (options.injectError) throw options.injectError
    return options.injectResult
  })
  const RenderSections = () => null
  const PageProvider = () => null

  const modules: Record<string, unknown> = {
    'src/plugins/my-plugin/pages/my-page': {
      loader: async () => 'LOADER_DATA',
      default: (data: unknown) => ({ page: data }),
    },
    'src/components/cms/GlobalSections': { getGlobalSectionsData },
    'src/components/cms/RenderSections': { default: RenderSections },
    'src/sdk/overrides/PageProvider': { default: PageProvider },
    'src/server/cms/global': { injectGlobalSections },
    'src/utils/localization/withLocaleValidation': {
      withLocaleValidationSSR: (fn: unknown) => fn,
    },
  }
  const require = (id: string) => {
    if (!(id in modules)) throw new Error(`Unexpected import: ${id}`)
    return modules[id]
  }
  const h = (
    type: unknown,
    props: Record<string, unknown> | null,
    ...children: unknown[]
  ): Element => ({ type, props: props ?? {}, children })
  const exports: Record<string, unknown> = {}

  new Function('require', 'exports', 'h', outputText)(require, exports, h)

  return {
    getServerSideProps:
      exports.getServerSideProps as Harness['getServerSideProps'],
    Page: exports.default as Harness['Page'],
    getGlobalSectionsData,
    injectGlobalSections,
    RenderSections,
    PageProvider,
  }
}

describe('getPluginPageFileContent', () => {
  describe('with appLayout', () => {
    const injected = {
      sections: [{ name: 'Navbar', data: {} }],
      settings: { analytics: true },
    }

    it('merges the global, header and footer sections in that order', async () => {
      // A swapped tuple (e.g. header and footer inverted) would still pass a
      // substring check, so the arguments are asserted per key.
      const { getServerSideProps, injectGlobalSections } = loadGeneratedPage(
        true,
        { injectResult: injected }
      )

      await getServerSideProps({})

      expect(injectGlobalSections).toHaveBeenCalledWith({
        globalSections: 'GLOBAL',
        globalSectionsHeader: 'HEADER',
        globalSectionsFooter: 'FOOTER',
      })
    })

    it('loads the global sections with the preview data and the locale', async () => {
      const { getServerSideProps, getGlobalSectionsData } = loadGeneratedPage(
        true,
        { injectResult: injected }
      )

      await getServerSideProps({
        previewData: { preview: true },
        locale: 'pt-BR',
      })

      expect(getGlobalSectionsData).toHaveBeenCalledWith({
        previewData: { preview: true },
        locale: 'pt-BR',
      })
    })

    it('passes the loader data, the sections and the settings as props', async () => {
      const { getServerSideProps } = loadGeneratedPage(true, {
        injectResult: injected,
      })

      await expect(getServerSideProps({})).resolves.toEqual({
        props: {
          data: 'LOADER_DATA',
          globalSections: injected.sections,
          globalSettings: injected.settings,
        },
      })
    })

    it('defaults the sections and the settings when the merge has none', async () => {
      const { getServerSideProps } = loadGeneratedPage(true, {
        injectResult: {},
      })

      await expect(getServerSideProps({})).resolves.toEqual({
        props: {
          data: 'LOADER_DATA',
          globalSections: [],
          globalSettings: null,
        },
      })
    })

    it('still renders the page, and logs, when the global sections fail', async () => {
      const error = new Error('CMS down')
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined)
      const { getServerSideProps } = loadGeneratedPage(true, {
        injectError: error,
      })

      await expect(getServerSideProps({})).resolves.toEqual({
        props: {
          data: 'LOADER_DATA',
          globalSections: [],
          globalSettings: null,
        },
      })
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('global sections'),
        error
      )

      consoleError.mockRestore()
    })

    it('wraps the page in PageProvider and RenderSections', () => {
      const { Page, PageProvider, RenderSections } = loadGeneratedPage(true)

      const tree = Page({
        data: 'PAGE_DATA',
        globalSections: ['SECTIONS'],
        globalSettings: { a: 1 },
      }) as Element
      const [renderSections] = tree.children as Element[]

      expect(tree.type).toBe(PageProvider)
      expect(tree.props).toEqual({ context: { globalSettings: { a: 1 } } })
      expect(renderSections.type).toBe(RenderSections)
      expect(renderSections.props).toEqual({ globalSections: ['SECTIONS'] })
      expect(renderSections.children).toEqual([{ page: 'PAGE_DATA' }])
    })
  })

  describe('without appLayout', () => {
    it('does not import or call anything for the global sections', async () => {
      const source = getPluginPageFileContent('my-plugin', 'my-page', false)

      expect(source).not.toContain('GlobalSections')
      expect(source).not.toContain('injectGlobalSections')
      expect(source).not.toContain('PageProvider')
      expect(source).not.toContain('RenderSections')
    })

    it('passes only the loader data and renders the page directly', async () => {
      const { getServerSideProps, Page } = loadGeneratedPage(false)

      await expect(getServerSideProps({})).resolves.toEqual({
        props: { data: 'LOADER_DATA' },
      })
      expect(Page({ data: 'PAGE_DATA' })).toEqual({ page: 'PAGE_DATA' })
    })
  })
})
