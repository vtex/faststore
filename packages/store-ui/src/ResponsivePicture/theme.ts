import { SxStyleProp } from 'theme-ui'

const responsivePicture: SxStyleProp = {
  picture: {
    display: 'block',
    overflow: 'hidden',
  },

  img: {
    minWidth: '100%',
    width: 'auto',
    height: 'auto',
    marginLeft: '50%',
    transform: 'translateX(-50%)',
    zIndex: -2,
  },
}

export default responsivePicture
