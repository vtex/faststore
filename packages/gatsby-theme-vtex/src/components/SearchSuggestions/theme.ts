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
  fontSize: 1,
  py: '5px',
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
    justifyContent: 'space-around',
    boxShadow: '0 5px 7px rgba(0,0,0,.2)',
    borderRadius: '0 0 5px 5px',
    minWidth: ['0px', '40rem'],
    minHeight: '400px',
    padding: '1rem',

    autocomplete: {
      paddingRight: '1rem',
      marginRight: '1rem',
      borderRightStyle: 'ridge',
      borderRightWidth: 'thin',

      minWidth: '20%',

      list,
      title,
      item,
    },

    products: {
      minWidth: '75%',

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

      minWidth: '35%',

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
      minWidth: ['100%', '35%'],

      list,
      title,
      item: {
        ...item,

        span: {
          mr: '15px',
          color: 'text',
        },
      },
    },
  },
}

export default theme
