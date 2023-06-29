import type { AlertOverrideDefinition } from '../components/sections/Alert/Overrides'
import type { BannerTextOverrideDefinition } from '../components/sections/BannerText/Overrides'
import type { BreadcrumbOverrideDefinition } from '../components/sections/Breadcrumb/Overrides'
import type { EmptyStateOverrideDefinition } from '../components/sections/EmptyState/Overrides'
import type { HeroOverrideDefinition } from '../components/sections/Hero/Overrides'
import type { NavbarOverrideDefinition } from '../components/sections/Navbar/Overrides'
import type { NewsletterOverrideDefinition } from '../components/sections/Newsletter/Overrides'
import type { ProductDetailsOverrideDefinition } from '../components/sections/ProductDetails/Overrides'
import type { ProductGalleryOverrideDefinition } from '../components/sections/ProductGallery/Overrides'
import type { ProductShelfOverrideDefinition } from '../components/sections/ProductShelf/Overrides'
import type { RegionBarOverrideDefinition } from '../components/sections/RegionBar/Overrides'

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

// Taken from https://dev.to/lucianbc/union-type-merging-in-typescript-9al
type AllKeys<T> = T extends any ? keyof T : never

type PickType<T, K extends AllKeys<T>> = T extends { [k in K]?: any }
  ? T[K]
  : undefined

type Merge<T> = {
  [k in AllKeys<T>]: PickType<T, k>;
};