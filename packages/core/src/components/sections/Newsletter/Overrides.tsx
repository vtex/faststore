import {
  Button as UIButton,
  InputField as UIInputField,
  Icon as UIIcon,
  Newsletter as UINewsletter,
  NewsletterContent as UINewsletterContent,
  NewsletterForm as UINewsletterForm,
  NewsletterHeader as UINewsletterHeader,
} from '@faststore/ui'

import { NewsletterAddendum as UINewsletterAddendum } from 'src/components/ui/Newsletter/NewsletterAddendum'

import { getSectionOverrides } from 'src/sdk/overrides/overrides'
import { override } from 'src/customizations/src/components/overrides/Newsletter'
import type { SectionOverrideDefinition } from 'src/typings/overridesDefinition'

const {
  Newsletter,
  NewsletterAddendum,
  NewsletterContent,
  NewsletterForm,
  NewsletterHeader,
  ToastIconSuccess,
  ToastIconError,
  HeaderIcon,
  InputFieldName,
  InputFieldEmail,
  Button,
} = getSectionOverrides(
  {
    Newsletter: UINewsletter,
    NewsletterAddendum: UINewsletterAddendum,
    NewsletterContent: UINewsletterContent,
    NewsletterForm: UINewsletterForm,
    NewsletterHeader: UINewsletterHeader,
    ToastIconSuccess: UIIcon,
    ToastIconError: UIIcon,
    HeaderIcon: UIIcon,
    InputFieldName: UIInputField,
    InputFieldEmail: UIInputField,
    Button: UIButton,
  },
  override as SectionOverrideDefinition<'Newsletter'>
)

export {
  Newsletter,
  NewsletterAddendum,
  NewsletterContent,
  NewsletterForm,
  NewsletterHeader,
  ToastIconSuccess,
  ToastIconError,
  HeaderIcon,
  InputFieldName,
  InputFieldEmail,
  Button,
}
