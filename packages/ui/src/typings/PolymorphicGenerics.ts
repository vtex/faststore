/**
 * These were heavily inspired by "Forwarding refs for a polymorphic React
 * component in TypeScript", written by Ben Ilegbodu.
 *
 * Article link: https://www.benmvp.com/blog/forwarding-refs-polymorphic-react-component-typescript/
 */

import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
} from 'react'

type AsProp<C extends ElementType> = {
  as?: C
}

/**
 * Allows for extending a set of props (`ExtendedProps`) by an overriding set of props
 * (`OverrideProps`), ensuring that any duplicates are overridden by the overriding
 * set of props.
 */
type ExtendableProps<
  ExtendedProps = Record<string, never>,
  OverrideProps = Record<string, never>
> = OverrideProps & Omit<ExtendedProps, keyof OverrideProps>

/**
 * Allows for inheriting the props from the specified element type so that
 * props like children, className & style work, as well as element-specific
 * attributes like aria roles. The component (`C`) must be passed in.
 */
type InheritableElementProps<
  C extends ElementType,
  Props = Record<string, never>
> = ExtendableProps<ComponentPropsWithoutRef<C>, Props>

export type PolymorphicComponentProps<
  C extends ElementType,
  Props = Record<string, never>
> = InheritableElementProps<C, Props & AsProp<C>>

export type PolymorphicComponentPropsWithRef<
  C extends ElementType,
  P = Record<string, never>
> = PolymorphicComponentProps<C, P> & { ref?: ComponentPropsWithRef<C>['ref'] }

// Extract the `ref` prop from a polymorphic component
export type PolymorphicRef<C extends ElementType> =
  PolymorphicComponentPropsWithRef<C>['ref']
