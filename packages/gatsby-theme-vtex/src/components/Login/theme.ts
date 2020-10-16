import { SxStyleProp } from '@vtex/store-ui'

const theme: SxStyleProp = {
  login: {
    button: {
      container: {
        color: '#979899',
        paddingLeft: '16px',
        paddingY: '8px',
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
      },

      greeting: {
        textTransform: 'uppercase',
        paddingX: '10px',
        fontSize: '14px',
        fontWeight: 500,
      },
    },
  },
}

export default theme
