export const getRoot = () => {
  if (process.env.OCLIF_COMPILATION) {
    return ''
  }

  return process.cwd()
}
