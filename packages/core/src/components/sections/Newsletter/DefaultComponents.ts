import {
  Button as UIButton,
  InputField as UIInputField,
  Icon as UIIcon,
  Newsletter as UINewsletter,
  NewsletterAddendum as UINewsletterAddendum,
  NewsletterContent as UINewsletterContent,
  NewsletterForm as UINewsletterForm,
  NewsletterHeader as UINewsletterHeader,
} from '@faststore/ui'

export const NewsletterDefaultComponents = {
  Button: UIButton,
  HeaderIcon: UIIcon,
  InputFieldEmail: UIInputField,
  InputFieldName: UIInputField,
  Newsletter: UINewsletter,
  NewsletterAddendum: UINewsletterAddendum,
  NewsletterContent: UINewsletterContent,
  NewsletterForm: UINewsletterForm,
  NewsletterHeader: UINewsletterHeader,
  ToastIconError: UIIcon,
  ToastIconSuccess: UIIcon,
} as const
