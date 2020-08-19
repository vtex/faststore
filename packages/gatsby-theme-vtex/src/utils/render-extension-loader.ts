// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

declare global {
  interface Window {
    __RENDER_6_RUNTIME__: any
    __RENDER_7_RUNTIME__: any
    __RUNTIME__: any
    $: typeof import('jquery')
    RenderExtensionLoader: any
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JQuery {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface jqXHR<TResolve> {
      retry: (opts: { timeout?: number; times?: number }) => TResolve
    }
  }
}

class RenderExtensionLoader {
  private account: string
  private workspace: string
  private path: string
  private locale: string
  private publicEndpoint: string
  private verbose: any
  private timeout: number
  private renderMajor: number
  private runtime: any
  private get: any
  private styles: string[]
  private scripts: string[]

  constructor({
    account,
    workspace,
    path,
    locale,
    publicEndpoint,
    verbose,
    timeout,
  }) {
    this.account = account
    this.workspace = workspace
    this.path = path
    this.locale = locale || 'en-US'
    this.verbose = verbose
    this.timeout = timeout
    this.publicEndpoint =
      publicEndpoint ||
      (/myvtexdev\.com/.test(window.location.hostname)
        ? 'myvtexdev.com'
        : 'myvtex.com')
    this.get = window.$
      ? (url: string) =>
          window.$.ajax({ url, timeout: this.timeout }).retry({
            timeout: 2000,
            times: 2,
          })
      : window.fetch
      ? (url: string) =>
          new Promise((resolve, reject) => {
            const fetchTimeout = setTimeout(() => {
              reject({ error: 'timeout' })
            }, this.timeout)

            window
              .fetch(url)
              .then((res) => {
                clearTimeout(fetchTimeout)

                return res
              })
              .then((res) => res.json())
              .then((res) => resolve(res))
          })
      : null

    if (!window.__RUNTIME__) {
      // This is the minimum necessary information for HMR to work and needs to be global.
      window.__RUNTIME__ = { account, workspace, publicEndpoint }
    }

    if (!this.get) {
      throw new Error(
        'Render Extension Loader requires either jQuery.ajax or window.fetch.'
      )
    }
  }

  public getRuntimeContext = async () => {
    if (!this.runtime) {
      await this.loadExtensionPointsContext()
    }

    return {
      runtime: this.runtime,
      scripts: this.scripts,
      styles: this.styles,
    }
  }

  public load = async () => {
    if (!this.runtime) {
      await this.loadExtensionPointsContext()
    }

    if (this.styles) {
      this.styles.forEach(this.addStyleToPage)
    }

    this.time('render-extension-loader:scripts')
    await Promise.all(this.scripts.map(this.addScriptToPage))
    this.timeEnd('render-extension-loader:scripts')

    return this.runtime
  }

  public update = (runtimeOrUpdateFn) => {
    if (typeof runtimeOrUpdateFn === 'function') {
      this.runtime = runtimeOrUpdateFn(this.runtime)
    } else {
      this.runtime = {
        ...this.runtime,
        ...runtimeOrUpdateFn,
      }
    }

    return this.runtime
  }

  public render = (extension, element, props) => {
    if (props) {
      this.runtime.extensions[extension].props = {
        ...this.runtime.extensions[extension].props,
        ...props,
      }
    }

    this.time('render-extension-loader:render')
    const runtime = window[`__RENDER_${this.renderMajor}_RUNTIME__`]

    runtime.render(extension, this.runtime, element)
    this.timeEnd('render-extension-loader:render')

    return this.runtime
  }

  private loadExtensionPointsContext = async () => {
    this.time('render-extension-loader:json')
    const { runtime, styles, scripts } = await this.get(
      `https://${this.workspace}--${this.account}.${this.publicEndpoint}/legacy-extensions${this.path}?__disableSSR&locale=${this.locale}&v=3&origin=${window.location.hostname}`
    )

    this.timeEnd('render-extension-loader:json')

    for (const key in window.__RUNTIME__ || {}) {
      if (
        Object.prototype.hasOwnProperty.call(window.__RUNTIME__, key) &&
        runtime[key] === undefined
      ) {
        runtime[key] = window.__RUNTIME__[key]
      }
    }

    this.setGlobalContext({ runtime, styles, scripts })

    return { runtime, styles, scripts }
  }

  private setGlobalContext = ({ runtime, styles, scripts }) => {
    this.renderMajor = runtime.renderMajor || 6
    this.styles = styles
    this.scripts = scripts
    this.runtime = {
      ...runtime,
      start: false,
    }
  }

  private getExistingScriptSrcs = () => {
    const paths = []

    for (let i = 0; i < document.scripts.length; i++) {
      paths.push(document.scripts.item(i).src)
    }

    return paths
  }

  private scriptOnPage = (path) => {
    return this.getExistingScriptSrcs().some((src) => src.indexOf(path) !== -1)
  }

  private addScriptToPage = (src) => {
    return new Promise((resolve, reject) => {
      if (this.scriptOnPage(src)) {
        return resolve()
      }

      const script = document.createElement('script')

      script.crossOrigin = 'anonymous'
      script.onload = () => resolve()
      script.onerror = () => reject()
      script.async = false
      script.src = src
      document.head.appendChild(script)
    })
  }

  private addStyleToPage = (href) => {
    const link = document.createElement('link')

    link.href = href
    link.type = 'text/css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }

  private time = (label) => {
    if (this.verbose) {
      console.time(label)
    }
  }

  private timeEnd = (label) => {
    if (this.verbose) {
      console.timeEnd(label)
    }
  }
}

export default RenderExtensionLoader
