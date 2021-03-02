import {
  SxStyleProp,
  productQuantityTheme as defaultProductQuantityTheme,
  createTheme,
} from '../../src'

export const productQuantityTheme: SxStyleProp = createTheme(
  defaultProductQuantityTheme,
  {
    productQuantity: {
      numericStepper: {
        height: '44px',
        marginLeft: 0,
        'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
          WebkitAppearance: 'none',
          margin: 0,
        },
        'input[type=number]': {
          MozAppearance: 'textfield',
        },
        input: {
          p: '8px',
          textAlign: 'center',
        },
        button: {
          '&:disabled': {
            color: '#101010',
            backgroundColor: '#efefef',
            cursor: 'default',
          },
          plus: {
            cursor: 'pointer',
          },
          minus: {
            cursor: 'pointer',
          },
        },
      },
    },
  }
)
