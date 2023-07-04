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
