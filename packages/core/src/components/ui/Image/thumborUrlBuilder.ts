export type FilterValue = boolean | string | string[] | number[]

export interface Box {
  top: number
  bottom: number
  left: number
  right: number
}

export interface ThumborOptions {
  flipHorizontal?: boolean
  flipVertical?: boolean
  trim?: boolean
  fitIn?: boolean
  horizontalAlign?: 'left' | 'center' | 'right'
  verticalAlign?: 'top' | 'middle' | 'bottom'
  smart?: boolean
  filters?: Record<string, FilterValue>
  manualCrop?: Box | false
}

const THUMBOR_SERVER = 'https://assets.vtex.app'

const cropSection = ({ left, top, right, bottom }: Box) =>
  `${left}x${top}:${right}x${bottom}`

function filtersURIComponent(filters: Record<string, FilterValue>) {
  const elements = ['filters']

  Object.keys(filters).forEach((name) => {
    const parameters = filters[name]
    let stringParameters

    // If we have several parameters, they were passed as an array
    // and now they need to be comma separated, otherwise there is just one to convert to a string
    if (Array.isArray(parameters)) {
      stringParameters = parameters.join(',')
    }
    // If true, we don't even need to do anything, we just have an empty string and insert ()
    // Ex: {grayscale: true} => grayscale()
    else if (parameters === true) {
      stringParameters = ''
    } else {
      stringParameters = String(parameters)
    }

    elements.push(`${name}(${stringParameters})`)
  })

  return elements.join(':')
}

export const urlBuilder = (baseUrl: string, options: ThumborOptions) => {
  const preSizeComponents = [THUMBOR_SERVER, 'unsafe']
  const postSizeComponents: string[] = []

  // Add the trim parameter after unsafe if appliable
  options.trim && preSizeComponents.push('trim')

  // Add the crop parameter if any
  options.manualCrop && preSizeComponents.push(cropSection(options.manualCrop))

  // Add the fit-in parameter after crop if appliable
  options.fitIn && preSizeComponents.push('fit-in')

  // Adds the horizontal alignement after the size
  postSizeComponents.push(options.horizontalAlign ?? 'center')

  // Adds the vertical alignement after the size
  postSizeComponents.push(options.verticalAlign ?? 'middle')

  // Adds the smart parameter if appliable
  options.smart && postSizeComponents.push('smart')

  // Compile the filters and add them right before the URI
  const { filters } = options

  filters && postSizeComponents.push(filtersURIComponent(filters))

  // Finally, adds the real image uri
  postSizeComponents.push(encodeURIComponent(baseUrl))

  return (width: number, height: number) => {
    // Adds the final size parameter
    let finalSize = ''

    if (options.flipHorizontal) {
      finalSize += '-'
    }

    finalSize += `${width}x`

    if (options.flipVertical) {
      finalSize += '-'
    }

    finalSize += `${height}`

    return [...preSizeComponents, finalSize, ...postSizeComponents].join('/')
  }
}
