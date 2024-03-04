import { useState } from 'react'

/**
 * Imagine this is an import to LoadableComposableSection's StatelessLoadableSection. We're declaring it here because in the
 * way overrides are implemented in FastStore, a component that contains an override requires a OverrideContext in upper in the tree, which is not
 * the case here.
 */
export function StatelessLoadableSection({ loading, setLoading }) {
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <button onClick={() => setLoading(true)}>Load</button>
    </>
  )
}

/** Showcases the possibility of not using overrides to build custom components based on
 * existing, composable inner components from the section
 **/
export function ComposedUISection() {
  const [loading, setLoadingState] = useState(false)

  const setLoading = () => {
    alert('This is a custom loading action!')
    setLoadingState(true)
  }

  return <StatelessLoadableSection loading={loading} setLoading={setLoading} />
}
