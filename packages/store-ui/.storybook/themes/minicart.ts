import { createTheme, minicartTheme, SxStyleProp } from '../../src'

const btn = {
  padding: 0,
  maxWidth: 40,
  minWidth: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  cursor: 'pointer',
}

const custom: SxStyleProp = {
  minicart: {
    drawer: {
      footer: {
        button: {
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#072c75',
          },
        },
      },
      content: {
        quantity: {
          width: 100,
          border: '2px solid #e3e4e6',

          wrapper: {
            marginTop: 3,
            alignItems: 'center',

            spinner: {
              marginLeft: 2,
            },
          },
        },
        delete: {
          marginLeft: 2,
          ...btn,
        },
      },
    },
  },
}

export const minicart = createTheme(minicartTheme, custom)
