import { LoadableSection } from '../components/LoadableSection'
import { getOverriddenSection } from '../../sdk/overrides/getOverriddenSection'
import { useState } from 'react'

/**
 * This component showcases how the root.loaded component does not have its state preserved
 * when re-rendered by the loading action. This is not an overrides limitation, as if the component as put
 * directly into that section, it would behave the same way. But there's not way to move the state up in the tree other
 * then wrapping the root with a context that can be read by root.loaded or composing the component yourself, meaning that the last
 * option would require moving out from overrides.
 */
const CustomLoadableSection = getOverriddenSection({
  Section: LoadableSection,
  components: {
    'root.loading': { Component: () => <h1>Custom loading state...</h1> },
    'root.loaded': {
      Component: () => {
        const [count, setCount] = useState(0)

        return (
          <button onClick={() => setCount((currentCount) => currentCount + 1)}>
            This button was clicked {count} times
          </button>
        )
      },
    },
  },
})

export { CustomLoadableSection }
