import { SectionsOverrides, SupportedSectionsOverridesV2 } from './overrides'

export type SectionOverrideDefinitionV1<
  SectionName extends keyof SectionsOverrides
> = Omit<SectionOverrideDefinition<SectionName>, 'Section'> & {
  section: SectionName
}

export type SectionOverrideDefinition<
  SectionName extends keyof SectionsOverrides
> = {
  /**
   * CSS class to be appended to the \<section\> element. Behaves similarly to React's className.
   * Default classNames from \<section\> element will still be applied.
   */
  className?: string
  /** Section to override. Accepts a React Component. */
  Section: SupportedSectionsOverridesV2[SectionName]
  /** An object containing component and prop overrides for section components */
  components?: Partial<Prettify<SectionsOverrides[SectionName]>>
}

export type OverriddenComponents<SectionName extends keyof SectionsOverrides> =
  {
    [Key in keyof SectionsOverrides[SectionName]]: Merge<
      SectionsOverrides[SectionName][Key]
    >
  }

export type DefaultSectionComponentsDefinitions<
  K extends keyof SectionsOverrides
> = Record<keyof SectionsOverrides[K], React.ComponentType>

export type ComponentOverrideDefinition<ComponentProps, Props> =
  | {
      Component?: never
      props: Partial<Props>
    }
  | {
      Component: React.ComponentType<ComponentProps>
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
