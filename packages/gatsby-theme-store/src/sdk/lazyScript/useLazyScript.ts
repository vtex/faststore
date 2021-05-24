import { useIdleEffect } from '@vtex/store-ui'

interface Options extends Partial<HTMLScriptElement> {
  id: string
  // add script to the page after timeout ms after idleCallback fired
  timeout?: number
}

const registerScript = ({
  id,
  timeout,
  async = true,
  ...scriptTagAttributes
}: Options) => {
  const maybeElement = document.getElementById(id)

  // Script already added to page
  if (maybeElement) {
    return
  }

  const script = document.createElement('script')
  const attributes = Object.keys(scriptTagAttributes) as Array<
    keyof HTMLScriptElement
  >

  attributes.forEach((attributeName) => {
    script.setAttribute(
      attributeName,
      (scriptTagAttributes as any)[attributeName]
    )
  })

  if (async) {
    script.setAttribute('async', '')
  }

  script.setAttribute('id', id)

  document.getElementsByTagName('head')[0].appendChild(script)
}

export const useLazyScript = (options: Options) =>
  useIdleEffect(() => {
    const timeout = options.timeout ?? 0

    setTimeout(() => registerScript(options), timeout)
  }, [])
