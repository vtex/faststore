import type { AlertOverrideDefinition } from 'src/components/sections/Alert/Overrides'
import type { BannerTextOverrideDefinition } from 'src/components/sections/BannerText/Overrides'
import type { BreadcrumbOverrideDefinition } from 'src/components/sections/Breadcrumb/Overrides'
import type { EmptyStateOverrideDefinition } from 'src/components/sections/EmptyState/Overrides'
import type { HeroOverrideDefinition } from 'src/components/sections/Hero/Overrides'
import type { NavbarOverrideDefinition } from 'src/components/sections/Navbar/Overrides'
import type { NewsletterOverrideDefinition } from 'src/components/sections/Newsletter/Overrides'
import type { ProductDetailsOverrideDefinition } from 'src/components/sections/ProductDetails/Overrides'
import type { ProductGalleryOverrideDefinition } from 'src/components/sections/ProductGallery/Overrides'
import type { ProductShelfOverrideDefinition } from 'src/components/sections/ProductShelf/Overrides'
import type { RegionBarOverrideDefinition } from 'src/components/sections/RegionBar/Overrides'

export type SectionOverride =
  | NewsletterOverrideDefinition
  | RegionBarOverrideDefinition
  | HeroOverrideDefinition
  | AlertOverrideDefinition
  | BannerTextOverrideDefinition
  | BreadcrumbOverrideDefinition
  | EmptyStateOverrideDefinition
  | NavbarOverrideDefinition
  | ProductShelfOverrideDefinition
  | ProductDetailsOverrideDefinition
  | ProductGalleryOverrideDefinition

export type GetSectionOverridesReturn<SO extends SectionOverride> = {
  [Key in keyof SO['components']]: Merge<SO['components'][Key]>
}

export type DefaultSectionComponentsDefinitions<
  T extends SectionOverrideDefinition
> = Record<keyof T['components'], React.ComponentType>

export type SectionOverrideDefinition<
  SectionName extends string = string,
  OC extends Record<string, ComponentOverrideDefinition<any, any>> = Record<
    string,
    ComponentOverrideDefinition<any, any>
  >
> = {
  section: SectionName
  components?: Partial<Prettify<OC>>
}

export type ComponentOverrideDefinition<ComponentProps, Props> =
  | {
      Component?: never
      props: Partial<Props>
    }
  | {
      Component: React.ComponentType<ComponentProps>
      props?: never
    }

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

type Subtract<A, C> = A extends C ? never : A
type AllKeys<T> = T extends any ? keyof T : never

type CommonKeys<T> = keyof T
type NonCommonKeys<T> = Subtract<AllKeys<T>, CommonKeys<T>>

type PickType<T, K extends AllKeys<T>> = T extends { [k in K]?: any }
  ? T[K]
  : undefined

type PickTypeOf<T, K extends string | number | symbol> = K extends AllKeys<T>
  ? PickType<T, K>
  : never

type Merge<T> = {
  [k in CommonKeys<T>]: PickTypeOf<T, k>
} & {
  [k in NonCommonKeys<T>]?: PickTypeOf<T, k>
}
