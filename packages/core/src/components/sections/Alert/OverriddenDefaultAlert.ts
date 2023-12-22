import { override } from 'src/customizations/src/components/overrides/Alert'
import { getOverriddenSection } from 'src/sdk/overrides/getOverriddenSection'
import Alert from '.'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default Alert section present in the Headless CMS
 */
export const OverriddenDefaultAlert = getOverriddenSection({
  ...override,
  Section: Alert,
})
