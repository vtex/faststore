import { SxStyleProp } from '../../src'

const productDetails: SxStyleProp = {
  reference: {
    fontSize: '16px',
    fontWeight: 400,
    color: '#727273',
  },

  title: {
    color: '#3f3f40',
    fontSize: '30px',
    fontWeight: 700,
  },

  container: {
    px: [0, 5, 6],
  },
}

export default {
  productDetails: { default: productDetails },
}
