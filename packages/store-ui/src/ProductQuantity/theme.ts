import { SxStyleProp } from 'theme-ui'

export const productQuantityTheme: SxStyleProp = {
  productQuantity: {
    flexDirection: 'column',

    title: {
      mt: 4,
      mb: 2,
      color: '#717172',
    },

    numericStepper: {
      alignItems: 'center',
      marginLeft: '5px',

      input: {
        width: 80,
        textAlign: 'center',
        margin: '-0.125rem',

        boxSizing: 'border-box',
        borderStyle: 'solid',
        borderWidth: '0.125rem',
        borderColor: '#e3e4e6',
      },

      button: {
        transition: 'opacity 150ms',

        boxSizing: 'border-box',
        borderStyle: 'solid',
        borderWidth: '0.125rem',
        borderColor: '#e3e4e6',

        backgroundColor: 'transparent',
        color: '#0f3e99',
        margin: 0,

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
