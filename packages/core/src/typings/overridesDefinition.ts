import { ComponentsFromSection, SectionsOverrides } from './overrides'

export type SectionOverrideDefinitionV1<
  SectionName extends keyof SectionsOverrides
> = {
  /**
   * CSS class to be appended to the \<section\> element. Behaves similarly to React's className.
   * Default classNames from \<section\> element will still be applied.
   */
  className?: string
  /** Name of the section to override */
  section: SectionName
  /** An object containing component and prop overrides for section components */
  components?: Partial<Prettify<SectionsOverrides[SectionName]['components']>>
}

export type SectionOverrideDefinition<
  Section extends SectionsOverrides[keyof SectionsOverrides]['Section']
> = {
  /**
   * CSS class to be appended to the \<section\> element. Behaves similarly to React's className.
   * Default classNames from \<section\> element will still be applied.
   */
  className?: string
  /** Section to override. Accepts a React Component. */
  Section: Section
  /** An object containing component and prop overrides for section components */
  components?: Partial<Prettify<ComponentsFromSection<Section>>>
}

export type OverriddenComponents<SectionName extends keyof SectionsOverrides> =
  {
    [Key in keyof SectionsOverrides[SectionName]['components']]: Merge<
      SectionsOverrides[SectionName]['components'][Key]
    >
  }

export type DefaultSectionComponentsDefinitions<
  K extends keyof SectionsOverrides
> = Record<keyof SectionsOverrides[K]['components'], React.ElementType>

export type ComponentOverrideDefinition<ComponentProps, Props> =
  | {
      Component?: never
      props: Partial<Props>
    }
  | {
      Component: React.ElementType<ComponentProps>
      props?: never
    }

/** This type makes complex types (usually generics) easier to read */
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

// Taken from https://dev.to/lucianbc/union-type-merging-in-typescript-9al
type AllKeys<T> = T extends any ? keyof T : never

type PickType<T, K extends AllKeys<T>> = T extends { [k in K]?: any }
  ? T[K]
  : undefined

export type Merge<T> = {
  [k in AllKeys<T>]: PickType<T, k>
}
