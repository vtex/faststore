import type { SxStyleProp } from 'theme-ui'

const productSummary: SxStyleProp = {
  container: {
    maxWidth: '300px',
    minWidth: '150px',
    textDecoration: 'none',
    color: 'text',
    flexGrow: 1,

    justifySelf: 'center',
    width: '100%',
  },

  title: {
    fontWeight: 400,
    fontSize: '14px',
    height: '75px',
    color: '#071923',
    marginTop: '1rem',
  },

  image: {
    width: '100%',
  },
}

export default { productSummary: { default: productSummary } }
