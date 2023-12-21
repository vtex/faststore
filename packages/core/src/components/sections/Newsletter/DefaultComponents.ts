import {
  Button as UIButton,
  InputField as UIInputField,
  Icon as UIIcon,
} from '@faststore/ui'
import { NewsletterAddendum } from 'src/components/ui/Newsletter/NewsletterAddendum'

export const NewsletterDefaultComponents = {
  ToastIconSuccess: UIIcon,
  ToastIconError: UIIcon,
  HeaderIcon: UIIcon,
  InputFieldName: UIInputField,
  InputFieldEmail: UIInputField,
  Button: UIButton,
  __experimentalNewsletterAddendum: NewsletterAddendum,
} as const
