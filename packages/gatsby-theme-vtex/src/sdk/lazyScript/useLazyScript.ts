import { useIdleEffect } from '../useIdleEffect'

interface Options {
  src: string
  id: string
  timeout?: number // add script to the page after timeout ms after idleCallback fired
}

const registerScript = ({ id, src }: Options) => {
  const maybeElement = document.getElementById(id)

  // Script already added to page
  if (maybeElement) {
    return
  }

  const script = document.createElement('script')

  script.setAttribute('async', '')
  script.setAttribute('type', 'application/javascript')
  script.setAttribute('id', id)
  script.setAttribute('src', src)
  document.getElementsByTagName('head')[0].appendChild(script)
}

export const useLazyScript = (options: Options) =>
  useIdleEffect(() => {
    const timeout = options.timeout ?? 0

    setTimeout(() => registerScript(options), timeout)
  }, [])
