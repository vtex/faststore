export * from '@faststore/components'

// Atoms
export { default as TextArea } from './components/atoms/TextArea'
export type { TextAreaProps } from './components/atoms/TextArea'

export { default as Incentive } from './components/atoms/Incentive'
export type { IncentiveProps } from './components/atoms/Incentive'

// Molecules

export { default as OrderSummary } from './components/molecules/OrderSummary'
export type { OrderSummaryProps } from './components/molecules/OrderSummary'

export { default as Bullets } from './components/molecules/Bullets'
export type { BulletsProps } from './components/molecules/Bullets'

export { default as Carousel } from './components/molecules/Carousel'
export type { CarouselProps } from './components/molecules/Carousel'

export {
  default as Banner,
  BannerContent,
  BannerImage,
  BannerLink,
} from './components/molecules/Banner'
export type {
  BannerProps,
  BannerContentProps,
  BannerImageProps,
  BannerLinkProps,
} from './components/molecules/Banner'

export { default as Form } from './components/molecules/Form'
export type { FormProps } from './components/molecules/Form'

// Organisms
export { Tile, Tiles } from './components/organisms/Tiles'
export type { TilesProps, TileProps } from './components/organisms/Tiles'

// Hooks
export { default as useSlider } from './hooks/useSlider'
export type {
  UseSliderArgs,
  SliderState,
  SliderDispatch,
  SlideDirection,
} from './hooks/useSlider'
