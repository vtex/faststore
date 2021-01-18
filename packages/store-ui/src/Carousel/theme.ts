import type { SxStyleProp } from '../index'
import { createTheme, responsivePictureTheme } from '../index'

const paginationDots: SxStyleProp = {
  container: {
    my: '0.5rem',
    position: 'absolute',
    justifyContent: 'center',
    display: 'flex',
    mx: 0,
    padding: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'auto',
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
    minHeight: `0.625rem`,
    minWidth: `0.625rem`,
  },
  activeDot: {
    bg: '#ff9d04',
    cursor: 'pointer',
    display: 'inline-block',
    borderRadius: '100%',
    margin: '12px 12px 12px 12px',
    padding: '0.25rem',
    borderWidth: 0,
    outline: '0',
    minHeight: `0.625rem`,
    minWidth: `0.625rem`,
  },
}

const carouselArrows: SxStyleProp = {
  left: {
    button: {
      display: ['none', 'block'],
      position: 'absolute',
      top: '50%',
      left: 0,
      zIndex: 1,
      bg: 'white',
      borderColor: 'transparent',
      cursor: 'pointer',

      '&:hover': {
        opacity: '0.5',
      },
    },

    svg: {
      display: ['none', 'block'],
      color: 'primary',
    },
  },

  right: {
    button: {
      display: ['none', 'block'],
      position: 'absolute',
      top: '50%',
      right: 0,
      zIndex: 1,
      bg: 'white',
      borderColor: 'transparent',
      cursor: 'pointer',

      '&:hover': {
        opacity: '0.5',
      },
    },

    svg: {
      display: ['none', 'block'],
      color: 'primary',
    },
  },
}

const carouselresponsivePicture = createTheme(responsivePictureTheme, {
  img: {
    height: ['238px', '540px'],
  },
})

const theme: SxStyleProp = {
  carousel: {
    position: 'relative',
    arrow: carouselArrows,
    paginationDots,
    responsivePicture: carouselresponsivePicture,
  },
}

export default theme
