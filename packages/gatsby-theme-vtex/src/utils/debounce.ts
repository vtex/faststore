// Code Extracted from:
// https://github.com/mui-org/material-ui/blob/2294351567479b30b481d692c29181ec0f22684f/packages/material-ui/src/utils/debounce.js#L1

// Corresponds to 10 frames at 60 Hz.
// A few bytes payload overhead when lodash/debounce is ~3 kB and debounce ~300 B.
export const debounce = <T extends any>(
  cb: (...args: any) => T,
  wait = 166
) => {
  let timeout: NodeJS.Timeout

  const debounced = (...args: any) => {
    const later = () => cb.apply(cb, args)

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }

  debounced.clear = () => clearTimeout(timeout)

  return debounced
}
