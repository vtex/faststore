import { useLoading } from '../components/LoadableComposableSection'

/** Showcases how users can use the composable state (hook) from a native section and completely customize the UI they're providing */
export function ComposedLoadableSection() {
  const [loading] = useLoading(false)

  if (loading) {
    return <div>Having lots of fun loading this!</div>
  }

  return "We're loaded!"
}
