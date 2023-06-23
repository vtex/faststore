import {
  Button as UIButton,
  InputField as UIInputField,
  Icon as UIIcon,
} from '@faststore/ui'

import NewsletterCustomizations from 'src/customizations/components/overrides/Newsletter'

const newsletterComponentsCustomization = {}

const newsletterPropsCustomization = {} as any

Object.entries(NewsletterCustomizations.components).forEach(([key, value]) => {
  if (value.Component) {
    newsletterComponentsCustomization[key] = value.Component
  }
})

Object.entries(NewsletterCustomizations.components).forEach(([key, value]) => {
  if (value.props) {
    newsletterPropsCustomization[key] = value.props
  }
})

const Components = {
  ToastIconSuccess: UIIcon,
  ToastIconError: UIIcon,
  HeaderIcon: UIIcon,
  InputFieldName: UIInputField,
  InputFieldEmail: UIInputField,
  Button: UIButton,
  ...newsletterComponentsCustomization,
}

export { Components, newsletterPropsCustomization as Props }
