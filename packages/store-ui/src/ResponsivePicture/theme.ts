import type { SxStyleProp } from 'theme-ui'

const responsivePicture: SxStyleProp = {
  picture: {
    display: 'block',
    overflow: 'hidden',
  },

  img: {
    height: 'auto',
    aspectRatio: '4 / 3',
    width: '100%',
    objectFit: 'cover',
  },
}

export default responsivePicture
