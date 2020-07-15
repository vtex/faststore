/** @jsx jsx */
import { FC } from 'react'
import { Link } from 'gatsby'
import { jsx, Button } from 'theme-ui'
import NukaCarousel, { CarouselProps } from 'nuka-carousel'

interface Item {
  src: string
  altText: string
  href?: string
}

interface Props {
  items: Item[]
  options?: CarouselProps
}

const defaultOptions: CarouselProps = {
  height: '800px',
  dragging: false,
}

const Image: FC<Item> = ({ src, altText, href }) => {
  if (href) {
    return <Link to={href}>Hello</Link>
  }

  return <img src={src} alt={altText} />
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
