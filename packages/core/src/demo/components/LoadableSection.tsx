import { useEffect, useState } from 'react'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import { getOverridableSection } from 'src/sdk/overrides/getOverriddenSection'

function LoadableSection({
  initialLoadingState,
}: {
  initialLoadingState?: boolean
}) {
  const { 'root.loading': Loading, 'root.loaded': Loaded } =
    useOverrideComponents<'Loadable'>()
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

  if (loading) {
    return <Loading.Component>Loading..</Loading.Component>
  }

  return (
    <>
      <button onClick={() => setLoading(true)}>Load</button>
      <Loaded.Component />
    </>
  )
}

const OverridableLoadableSection = getOverridableSection(
  'Loadable',
  LoadableSection,
  {
    'root.loading': 'div',
    'root.loaded': 'div',
  }
)

export { OverridableLoadableSection as LoadableSection }
