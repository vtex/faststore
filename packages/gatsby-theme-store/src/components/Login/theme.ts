import type { SxStyleProp } from '@vtex/store-ui'

const theme: SxStyleProp = {
  login: {
    button: {
      container: {
        color: '#656667',
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
