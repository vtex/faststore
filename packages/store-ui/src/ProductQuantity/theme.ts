import { SxStyleProp } from 'theme-ui'

export const productQuantityTheme: SxStyleProp = {
  productQuantity: {
    flexDirection: 'column',

    title: {
      mt: 4,
      mb: 2,
      color: '#717172',
      fontSize: '14px',
    },

    numericStepper: {
      alignItems: 'center',
      marginLeft: '5px',

      input: {
        width: 80,
        textAlign: 'center',
        margin: 0,

        boxSizing: 'border-box',
        borderStyle: 'solid',
        borderWidth: '0.125rem',
        borderColor: '#e3e4e6',
        borderRadius: 0,
      },

      button: {
        transition: 'opacity 150ms',

        boxSizing: 'border-box',
        borderStyle: 'solid',
        borderColor: '#e3e4e6',

        backgroundColor: 'transparent',
        color: '#0f3e99',

        minus: {
          borderWidth: '0.125rem',
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderRightWidth: 0,
        },

        plus: {
          borderWidth: '0.125rem',
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderLeftWidth: 0,
        },
      },
    },
  },
}
