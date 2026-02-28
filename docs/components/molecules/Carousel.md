# Carousel

## Intention
Slideshow for displaying multiple items in sequence.

## Description
Carousel displays items in a sliding interface with navigation controls and optional bullets. Supports touch/swipe gestures and keyboard navigation.

In ecommerce, used for product images, promotional banners, featured products.

## Import
```tsx
import { Carousel } from '@faststore/components'
```

## Sub-components
- `CarouselItem` - Individual slide
- `CarouselBullets` - Pagination dots

## Examples

```tsx
<Carousel>
  <CarouselItem>
    <img src="/banner1.jpg" alt="Sale Banner" />
  </CarouselItem>
  <CarouselItem>
    <img src="/banner2.jpg" alt="New Arrivals" />
  </CarouselItem>
  <CarouselBullets />
</Carousel>
```
