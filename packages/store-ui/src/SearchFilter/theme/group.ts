import { SxStyleProp } from 'theme-ui'

export const groupTheme: SxStyleProp = {
  accordion: {
    collapsible: {
      paddingBottom: '16px',
      borderBottom: '1px solid #e3e4e6',

      header: {
        backgroundColor: '#fff',
        fontSize: '16px',
        height: '50px',
        width: '100%',
        textAlign: 'left',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',

        icon: {
          width: '50px',
          height: '50px',
          color: '#cacbcc',
          alignItems: 'center',

          g: {
            transform: 'translate(40%, 40%)',
          },
        },
      },

      ul: {
        maxHeight: '210px',
        overflowY: 'scroll',
        listStyleType: 'none',
        margin: 0,
        px: 0,
      },

      a: {
        textDecoration: 'none',
        color: 'inherit',
      },

      li: {
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        minHeight: '24px',

        checkbox: {
          color: '#d2d2d2',
          my: 'auto',
        },

        value: {
          fontSize: '14px',
          my: 'auto',
          '&:hover': {
            opacity: '.5',
          },
        },

        quantity: {
          color: '#a5a5a5',
          ml: '12px',
          marginTop: '1px',
          fontSize: '1rem',
        },
      },
    },
  },
}
