import type { SxStyleProp } from 'theme-ui'

const responsivePicture: SxStyleProp = {
  picture: {
    display: 'block',
    overflow: 'hidden',
    height: '350px',
  },

  img: {
    width: '100%',
    objectFit: 'cover',
  },
}

export default responsivePicture
