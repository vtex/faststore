export const minicartTheme = {
  minicart: {
    background: '#f0f0f0',
    position: 'relative',
    marginLeft: 2,
    cursor: 'pointer',

    badge: {
      background: '#f71963',
      borderRadius: '100%',
      height: 16,
      position: 'absolute',
      width: 16,
      top: 0,
      right: 0,
      fontSize: 10,
    },

    drawer: {
      height: '100%',
      flexDirection: 'column',
      overflow: 'hidden',

      header: {
        p: 3,

        title: {
          pt: 3,
        },
      },

      content: {
        flexDirection: 'column',
        flex: 1,
        overflow: 'auto',
        px: 3,
      },

      product: {
        py: 3,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: 'muted',

        '&:last-child': {
          borderWidth: 0,
        },

        image: {
          height: 96,
          width: 96,
        },

        name: {
          flexDirection: 'column',
          ml: 3,

          value: {
            mt: 3,
          },
        },
      },

      footer: {
        p: 3,
        flexDirection: 'column',
        boxShadow: '0 0 12px rgba(0,0,0,.15)',

        subtotal: {
          justifyContent: 'space-between',
        },

        total: {
          justifyContent: 'space-between',

          text: {
            fontSize: 4,
          },

          value: {
            fontSize: 4,
          },
        },

        message: {
          my: 3,
        },
      },
    },
  },
}
