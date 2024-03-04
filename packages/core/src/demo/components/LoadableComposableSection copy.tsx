import { useEffect, useState } from 'react'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import { getOverridableSection } from 'src/sdk/overrides/getOverriddenSection'

export function useLoading(initialLoadingState: boolean) {
  const [loading, setLoading] = useState(Boolean(initialLoadingState))

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (loading) {
      timeoutId = setTimeout(() => {
        setLoading(false)
      }, 3000)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  })

  return [loading, setLoading] as const
}

export type StatelessLoadableSectionProps = {
  loading: boolean
  setLoading: (loading: boolean) => void
}

export function StatelessLoadableSection({
  loading,
  setLoading,
}: StatelessLoadableSectionProps) {
  const {
    'root.loading': LoadingComponent,
    'root.loaded': LoadedComponent,
    /**
     * Define the default components here
     * Easier to see the definitions, possibly better performance because it's only imported when needed
     * Makes StatelessLoadableSection usable even when outside override context
     * Fixes what we have described in the ComposedUISection component
     **/
  } = useOverrideComponents<'LoadableComposable'>({
    'root.loading': 'div',
    'root.loaded': 'div',
  })

  if (loading) {
    return <LoadingComponent.Component>Loading...</LoadingComponent.Component>
  }

  return (
    <>
      <button onClick={() => setLoading(true)}>Load</button>
      <LoadedComponent.Component />
    </>
  )
}

function LoadableComposableSection({
  initialLoadingState,
}: {
  initialLoadingState?: boolean
}) {
  const { root: Root } = useOverrideComponents<'LoadableComposable'>()
  const [loading, setLoading] = useLoading(Boolean(initialLoadingState))

  return (
    <Root.Component loading={loading} setLoading={setLoading} {...Root.props} />
  )
}

const OverridableLoadableComposableSection = getOverridableSection(
  'LoadableComposable',
  LoadableComposableSection,
  {
    root: StatelessLoadableSection,
    'root.loading': 'div',
    'root.loaded': 'div',
  }
)

export { OverridableLoadableComposableSection as LoadableComposableSection }
