import type { ThemeUIStyleObject } from 'theme-ui'

const responsivePicture: ThemeUIStyleObject = {
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
