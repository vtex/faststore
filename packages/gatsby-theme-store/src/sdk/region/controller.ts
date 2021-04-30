const postalCode = {
  get: () => window.localStorage.getItem('vtex:postalCode'),
  set: (value: Maybe<string>) => {
    if (value) {
      localStorage.setItem('vtex:postalCode', value)
    } else {
      localStorage.removeItem('vtex:postalCode')
    }
  },
}

const region = {
  get: () => window.localStorage.getItem('vtex:regionId'),
  set: (value: Maybe<string>) => {
    if (value) {
      localStorage.setItem('vtex:regionId', value)
    } else {
      localStorage.removeItem('vtex:regionId')
    }
  },
}

export default {
  region,
  postalCode,
}
