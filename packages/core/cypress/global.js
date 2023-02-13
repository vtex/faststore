import storeConfig from '../faststore.config'

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
