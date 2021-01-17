export const once = <T extends (...args: any[]) => any>(fn: T) => {
  let run = true
  let res: ReturnType<T> | null = null

  return (...args: Parameters<T>) => {
    if (run === true) {
      res = fn(...args)
      run = false
    }

    return res
  }
}
