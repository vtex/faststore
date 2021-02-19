import type { SxStyleProp } from 'theme-ui'

export const accordionTheme: SxStyleProp = {
  accordion: {
    collapsible: {
      paddingBottom: '16px',
      borderBottom: '1px solid #e3e4e6',

      header: {
        fontSize: '1rem',
        height: '50px',
        width: '100%',
        textAlign: 'left',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',

        icon: {
          width: '50px',
          height: '50px',
          color: 'muted',
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

      price: {
        maxHeight: '210px',
        margin: 0,
        px: 0,
        range: {
          ':focus': {
            outline: 0,
          },
        },
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
          cursor: 'pointer',
          color: 'muted',
          my: 'auto',
        },

        value: {
          cursor: 'pointer',
          fontSize: '14px',
          my: 'auto',
          '&:hover': {
            color: 'textMuted',
          },
        },

        quantity: {
          color: 'textMuted',
          ml: '12px',
          marginTop: '1px',
          fontSize: '1rem',
        },
      },
    },
  },
}
