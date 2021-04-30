import { createTheme, minicartTheme, ThemeUIStyleObject } from '../../src'

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

const custom: ThemeUIStyleObject = {
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
