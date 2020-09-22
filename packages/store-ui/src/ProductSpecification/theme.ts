import { SxStyleProp } from 'theme-ui'

export const productSpecificationTheme: SxStyleProp = {
  productSpecification: {
    flexDirection: 'column',

    title: {
      mt: 4,
      mb: 2,
    },

    item: {
      name: {
        flex: 1,
      },

      value: {
        flex: 2,
      },
    },
  },
}
