import {
  LoadableComposableSection,
  StatelessLoadableSection,
} from '../components/LoadableComposableSection'
import { getOverriddenSection } from '../../sdk/overrides/getOverriddenSection'

/** Showcases the possible and sometimes desirable mix between overrides and composable inner components */
const CustomLoadableComposableSection = getOverriddenSection({
  Section: LoadableComposableSection,
  components: {
    root: {
      Component: (props) => {
        return (
          <StatelessLoadableSection
            {...props}
            setLoading={(isLoading) => {
              alert('Loading!')
              props.setLoading(isLoading)
            }}
          />
        )
      },
    },
    'root.loading': { Component: () => <h1>Custom loading state...</h1> },
  },
})

export { CustomLoadableComposableSection }
