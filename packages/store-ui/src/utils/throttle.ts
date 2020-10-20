const throttle = <T extends any>(cb: (...args: any) => T, wait = 166) => {
  let timeout: NodeJS.Timeout | null = null

  const throttled = (...args: any): T | undefined => {
    if (timeout !== null) {
      return
    }

    const later = () => {
      timeout = null
    }

    timeout = setTimeout(later, wait)

    return cb.apply(cb, args)
  }

  return throttled
}

export default throttle
