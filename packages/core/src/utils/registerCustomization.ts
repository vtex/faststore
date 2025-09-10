import Customizations from '../customizations/src/components'

export function registerCustomization(config: Record<string, any>) {
  Object.entries(config).forEach(([k, v]) => {
    Customizations[k] = v
  })

  return Customizations
}
