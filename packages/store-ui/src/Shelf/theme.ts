import type { ThemeUIStyleObject } from 'theme-ui'

const theme: ThemeUIStyleObject = {
  shelf: {
    default: {
      container: {
        width: '100%',
        height: '585px',
        marginTop: '20px',
        marginBottom: '120px',
      },

      title: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '32px',
        fontWeight: 200,
        my: '20px',
      },

      arrow: {
        left: {
          button: {
            bg: 'transparent',
            borderColor: 'transparent',
            cursor: 'pointer',

            '&:hover': {
              opacity: '0.5',
            },
          },

          svg: {
            color: 'text',
          },
        },

        right: {
          button: {
            bg: 'transparent',
            borderColor: 'transparent',
            cursor: 'pointer',

            '&:hover': {
              opacity: '0.5',
            },
          },

          svg: {
            color: 'text',
          },
        },
      },

      paginationDots: {
        container: {
          paddingY: '10px',
          paddingX: 0,
          marginTop: '0.5rem',
          marginBottom: '0.5rem',
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          margin: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },

        dot: {
          bg: '#a8a8a8',
          cursor: 'pointer',
          display: 'inline-block',
          borderRadius: '100%',
          margin: '12px 12px 12px 12px',
          padding: '0.25rem',
          borderWidth: 0,
          outline: '0',
          height: `0.725rem`,
          width: `0.725rem`,
        },

        activeDot: {
          bg: 'secondary',
          cursor: 'pointer',
          display: 'inline-block',
          borderRadius: '100%',
          margin: '12px 12px 12px 12px',
          padding: '0.25rem',
          borderWidth: 0,
          outline: '0',
          height: `0.725rem`,
          width: `0.725rem`,
        },
      },
    },
  },
}

export default theme
