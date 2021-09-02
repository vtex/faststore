import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
} from 'react'

export type PolymorphicProps<C = any, P = any> = Omit<C, keyof P> & P

export type PolymorphicComponentProps<
  C extends ElementType,
  P = any
> = PolymorphicProps<ComponentPropsWithoutRef<C>, P & { as?: C }>

export type PolymorphicComponentPropsWithRef<
  C extends ElementType,
  P = any
> = PolymorphicComponentProps<C, P> & { ref?: ComponentPropsWithRef<C>['ref'] }
