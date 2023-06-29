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

export type SectionOverrideDefinition<
  SectionName extends string = string,
  OC extends Record<string, unknown> = Record<string, unknown>
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

export type ComponentOverride<
  COP extends MergeProps<ComponentOverrideDefinition<any, any>>
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
