import {
  Button as UIButton,
  InputField as UIInputField,
  Icon as UIIcon,
} from '@faststore/ui'
import { NewsletterAddendum } from 'src/components/ui/Newsletter/NewsletterAddendum'

import { getSectionOverrides } from 'src/sdk/overrides/overrides'
import { override } from 'src/customizations/src/components/overrides/Newsletter'
import type { SectionOverrideDefinitionV1 } from 'src/typings/overridesDefinition'

const {
  ToastIconSuccess,
  ToastIconError,
  HeaderIcon,
  InputFieldName,
  InputFieldEmail,
  Button,
  __experimentalNewsletterAddendum,
} = getSectionOverrides(
  {
    ToastIconSuccess: UIIcon,
    ToastIconError: UIIcon,
    HeaderIcon: UIIcon,
    InputFieldName: UIInputField,
    InputFieldEmail: UIInputField,
    Button: UIButton,
    __experimentalNewsletterAddendum: NewsletterAddendum,
  },
  override as SectionOverrideDefinitionV1<'Newsletter'>
)

export {
  ToastIconSuccess,
  ToastIconError,
  HeaderIcon,
  InputFieldName,
  InputFieldEmail,
  Button,
  __experimentalNewsletterAddendum,
}
