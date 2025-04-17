import {
  forwardRef,
  type ElementType,
  type ReactElement,
  type ForwardRefRenderFunction,
  type PropsWithoutRef,
} from 'react'
import type {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from './typings'

/**
 *
 */
export function createPolymorphicComponent<C extends ElementType, P>(
  render: (
    props: PolymorphicComponentPropsWithRef<C, P>,
    ref: PolymorphicRef<C>
  ) => ReactElement | null
) {
  return forwardRef(
    render as ForwardRefRenderFunction<C, PropsWithoutRef<P>>
  ) as unknown as <T extends ElementType = C>(
    props: PolymorphicComponentPropsWithRef<T, P> & { ref?: PolymorphicRef<T> }
  ) => ReactElement | null
}
