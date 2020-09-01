let guid = 1

export function getGUID() {
  return (guid++ * new Date().getTime() * -1).toString().replace('-', '')
}
