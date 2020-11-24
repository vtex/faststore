import { SxStyleProp } from '@vtex/store-ui'

const title: SxStyleProp = {
  textTransform: 'uppercase',
  fontSize: 2,
  fontWeight: 'bold',
}

const list: SxStyleProp = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
}

const item: SxStyleProp = {
  cursor: 'pointer',
  borderRadius: '4px',
  padding: '5px 10px',
  fontSize: 1,
  display: 'block',
  width: '100%',
  '&:hover': {
    backgroundColor: 'lightgrey',
  },
}

const theme: SxStyleProp = {
  suggestions: {
    color: 'text',
    backgroundColor: 'white',
    justifyContent: 'left',
    boxShadow: '0 5px 7px rgba(0,0,0,.2)',
    borderRadius: '0 0 5px 5px',
    width: '100%',
    marginTop: '5px',
    minWidth: ['0px', '40rem'],
    minHeight: '400px',
    padding: '1rem',
    zIndex: 99,

    autocomplete: {
      paddingRight: '1rem',
      marginRight: '1rem',
      borderRightStyle: 'ridge',
      borderRightWidth: 'thin',

      list,
      title,
      item,
    },

    products: {
      width: 'inherit',

      button: {
        backgroundColor: 'primary',
      },

      title,

      list: {
        ...list,
        display: 'flex',
        flexWrap: 'nowrap',
      },

      total: {
        paddingTop: '10px',
        color: 'text',
        textDecoration: 'underline',
        textAlign: 'center',
        cursor: 'pointer',
        width: '100%',
        backgroundColor: 'white',
      },
    },

    history: {
      paddingLeft: '2rem',
      borderLeftStyle: 'ridge',
      borderLeftWidth: 'thin',

      list,
      title,
      item: {
        ...item,

        span: {
          mr: '15px',
        },
      },
    },

    topSearches: {
      marginRight: [0, '2rem'],

      list,
      title,
      item: {
        ...item,

        span: {
          display: 'inline-block',
          minWidth: '30px',
          color: 'text',
        },
      },
    },
  },
}

export default theme
