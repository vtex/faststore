import { SxStyleProp } from 'theme-ui'

export const productQuantityTheme: SxStyleProp = {
  productQuantity: {
    flexDirection: 'column',

    title: {
      mt: 4,
      mb: 2,
    },

    numericStepper: {
      button: {
        width: '2em',
        transition: 'opacity 150ms',

        minus: {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        },

        plus: {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        },
      },
    },
  },
}
