const postalCode = {
  get: () =>
    typeof window !== 'undefined'
      ? window?.localStorage?.getItem('vtex:postalCode')
      : null,
  set: (value: Maybe<string>) => {
    if (value) {
      localStorage.setItem('vtex:postalCode', value)
    } else {
      localStorage.removeItem('vtex:postalCode')
    }
  },
}

const region = {
  get: () =>
    typeof window !== 'undefined'
      ? window?.localStorage?.getItem('vtex:regionId')
      : null,
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
