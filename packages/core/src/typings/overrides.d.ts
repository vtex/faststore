import type { AlertOverrides } from 'src/components/sections/Alert/Overrides'
import type { BannerTextOverrides } from 'src/components/sections/BannerText/Overrides'
import type { BreadcrumbOverrides } from 'src/components/sections/Breadcrumb/Overrides'
import type { EmptyStateOverrides } from 'src/components/sections/EmptyState/Overrides'
import type { HeroOverrides } from 'src/components/sections/Hero/Overrides'
import type { NavbarOverrides } from 'src/components/sections/Navbar/Overrides'
import type { NewsletterOverrideDefinition } from 'src/components/sections/Newsletter/Overrides'
import type { ProductDetailsOverrides } from 'src/components/sections/ProductDetails/Overrides'
import type { ProductGalleryOverrides } from 'src/components/sections/ProductGallery/Overrides'
import type { ProductShelfOverrides } from 'src/components/sections/ProductShelf/Overrides'
import type { RegionBarOverrideDefinition } from 'src/components/sections/RegionBar/Overrides'

export type SectionOverride =
  | NewsletterOverrideDefinition
  | RegionBarOverrideDefinition
  | HeroOverrideDefinition
  | AlertOverrideDefinition
  | BannerOverrideDefinition
  | BreadcrumbOverrideDefinition
  | EmptyStateOverrideDefinition
  | NavbarOverrideDefinition

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

type MergeProps<U> = {
  [K in keyof UnionToIntersection<U>]: UnionToIntersection<U>[K]
}
export type GetSectionOverridesReturn<SO extends SectionOverride> = {
  [Key in keyof SO['components']]: ComponentOverride<
    MergeProps<SO['components'][Key]>
  >
}

export type DefaultSectionComponentsDefinitions<
  T extends SectionOverrideDefinition
> = Record<keyof T['components'], React.ComponentType>

export type SectionOverrideDefinition<SectionName extends string, OC> = {
  name: SectionName
  components?: Partial<Prettify<OC>>
}

// Hero: HeroOverrides
// BannerText: BannerTextOverrides
// ProductDetails: ProductDetailsOverrides
// ProductShelf: ProductShelfOverrides
// Navbar: NavbarOverrides
// Breadcrumb: BreadcrumbOverrides
// ProductGallery: ProductGalleryOverrides
// Alert: AlertOverrides
// EmptyState: EmptyStateOverrides
// RegionBar: RegionBarOverrides
// Newsletter: NewsletterOverrides

export type ComponentOverrideDefinition<ComponentProps, Props> =
  | {
      Component?: never
      props: Partial<Props>
    }
  | {
      Component: React.ComponentType<ComponentProps>
      props?: never
    }

export type ComponentOverride<
  COP extends MergeProps<ComponentOverrideDefinition>
> = COP extends MergeProps<
  ComponentOverrideDefinition<infer ComponentProps, infer Props>
>
  ? {
      Component: React.ComponentType<ComponentProps>
      props: Partial<Props>
    }
  : never

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
