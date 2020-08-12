import { SxStyleProp } from 'theme-ui'

const CardTheme: SxStyleProp = {
  card: {
    margin: '0 auto',
    width: '100%',
    maxWidth: ['100%', '100%', '96rem'],
    maxHeight: '540px',
    bg: '#e0efe0',
    flexWrap: 'wrap',

    image: {
      width: ['100%', '70%'],
      display: 'inline',
      maxHeight: '540px',
      objectFit: 'cover',

      link: {
        flex: 1,
      },
      content: {
        width: '100%',
      },
    },

    info: {
      padding: [3, 0, 0],
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: ['100%', '30%'],

      action: {
        marginTop: 3,
      },
    },
  },
}

export default CardTheme
