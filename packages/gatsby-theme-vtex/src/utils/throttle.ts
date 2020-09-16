export const throttle = <T extends any>(
  cb: (...args: any) => T,
  wait = 166
) => {
  let isThrottled = false
  let lastReturn: T | undefined

  const throttled = (...args: any) => {
    if (isThrottled && lastReturn !== undefined) {
      return lastReturn
    }

    lastReturn = cb(args)

    if (!isThrottled) {
      isThrottled = true
      setTimeout(() => {
        isThrottled = false
      }, wait)
    }

    return lastReturn
  }

  return throttled
}
