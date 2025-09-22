import { loadConfig as baseLoadConfig } from 'c12'

export async function loadConfig() {
  const { config } = await baseLoadConfig({
    name: 'discovery',
  })

  return config
}
