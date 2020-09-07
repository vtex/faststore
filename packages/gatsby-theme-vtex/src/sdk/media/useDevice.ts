import { useResponsiveValue } from '@theme-ui/match-media'

type Device = 'mobile' | 'desktop'

const devices: Device[] = ['mobile', 'desktop']

export const useDevice = () => {
  const currentDevice = useResponsiveValue(devices)
  const defaultDevice = 'mobile'

  return [defaultDevice, currentDevice]
}
