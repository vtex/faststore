const postalCode = {
  get: () => {
    if (navigator.cookieEnabled) {
      return window.localStorage.getItem('vtex:postalCode')
    }

    return null
  },
  set: (value: Maybe<string>) => {
    if (navigator.cookieEnabled) {
      if (value) {
        localStorage.setItem('vtex:postalCode', value)
      } else {
        localStorage.removeItem('vtex:postalCode')
      }
    }
  },
}

const region = {
  get: () => {
    if (navigator.cookieEnabled) {
      return window.localStorage.getItem('vtex:regionId')
    }

    return null
  },
  set: (value: Maybe<string>) => {
    if (navigator.cookieEnabled) {
      if (value) {
        localStorage.setItem('vtex:regionId', value)
      } else {
        localStorage.removeItem('vtex:regionId')
      }
    }
  },
}

export default {
  region,
  postalCode,
}
