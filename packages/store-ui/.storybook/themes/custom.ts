import { SxStyleProp } from '../../src'

export const custom: SxStyleProp = {
  'rich-text': {
    default: {
      color: 'textBold',
      fontSize: 2,
      fontWeight: 'bold',
      textAlign: 'center',
      textTransform: 'uppercase',
    },
    question: {
      color: 'textBold',
      fontSize: 5,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    link: {
      color: 'textBold',
      fontSize: 4,
      textAlign: 'center',
      textTransform: 'uppercase',
      textDecoration: 'none',
    },
    dealsRow: {
      color: 'white',
    },
  },
  buttons: {
    loadMore: {
      width: '100%',
      cursor: 'pointer',
      '&:disabled': {
        cursor: 'default',
        background: '#fff',
        color: 'text',
      },
    },
  },
  grids: {
    search: {
      my: 4,
      gap: 3,
    },
  },
  shelfTitle: {
    fontSize: '2.25rem',
    fontWeight: 200,
    color: '#727273',
  },

  productTitle: {
    mb: 4,
  },
  productPage: {
    container: {
      my: 4,
      mx: 0,
      flexDirection: 'column',
    },
  },

  alerts: {
    signInDanger: {
      color: 'text',
      bg: '#ffe6e6',
      fontSize: '14px',
      fontWeight: 300,
    },
  },
}
