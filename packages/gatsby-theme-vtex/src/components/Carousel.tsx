/** @jsx jsx */
import { FC } from 'react'
import { Link } from 'gatsby'
import { jsx, Button, Box } from 'theme-ui'
import NukaCarousel, { CarouselProps } from 'nuka-carousel'

interface Item {
  src: {
    desktop: string
    mobile: string
  }
  altText: string
  href?: string
}

interface Props {
  items: Item[]
  options?: CarouselProps
}

const defaultOptions: CarouselProps = {
  dragging: false,
  heightMode: 'first',
  initialSlideHeight: 300,
}

const Image: FC<Item> = ({ src, href }) => {
  if (href) {
    return <Link to={href}>Hello</Link>
  }

  return (
    <Box
      sx={{
        backgroundImage: [`url(${src.mobile})`, `url(${src.desktop})`],
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        width: '100%',
        height: [300, 400, 500],
      }}
    />
  )
}

const Carousel: FC<Props> = ({ items, options = defaultOptions }) => (
  <NukaCarousel
    renderCenterLeftControls={({ previousSlide }) => (
      <Button variant="carousel-previous" onClick={previousSlide}>
        Previous
      </Button>
    )}
    renderCenterRightControls={({ nextSlide }) => (
      <Button variant="carousel-next" onClick={nextSlide}>
        Next
      </Button>
    )}
    {...options}
  >
    {items.map((item) => (
      <Image key={item.altText} {...item} />
    ))}
  </NukaCarousel>
)

export default Carousel
