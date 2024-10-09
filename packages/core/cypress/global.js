import storeConfig from '../discovery.config'

export const { pages } = storeConfig.cypress

export const options = {
  onBeforeLoad: () => {
    if (window.navigator && navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister()
        })
      })
    }
  },
}

// TODO: Bring back these rules when the components with missing/wrong role is found.
export const disabledA11yRules = {
  rules: {
    region: { enabled: false },
    'aria-allowed-role': { enabled: false },
  },
}
