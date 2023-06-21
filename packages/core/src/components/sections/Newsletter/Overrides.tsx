import {
  Button as UIButton,
  InputField as UIInputField,
  Icon as UIIcon,
} from '@faststore/ui'
import type { ButtonProps, IconProps, InputFieldProps } from '@faststore/ui'

import { getSectionOverrides } from 'src/utils/overrides'
import type {
  ComponentOverrideDefinition,
  SectionOverrideDefinition,
} from 'src/typings/overrides'
import { override } from 'src/customizations/components/overrides/Newsletter'

export type NewsletterOverrideDefinition = SectionOverrideDefinition<
  'Newsletter',
  {
    ToastIconSuccess: ComponentOverrideDefinition<IconProps, IconProps>
    ToastIconError: ComponentOverrideDefinition<IconProps, IconProps>
    HeaderIcon: ComponentOverrideDefinition<IconProps, IconProps>
    InputFieldName: ComponentOverrideDefinition<
      InputFieldProps,
      Omit<InputFieldProps, 'inputRef'>
    >
    InputFieldEmail: ComponentOverrideDefinition<
      InputFieldProps,
      Omit<InputFieldProps, 'inputRef'>
    >
    Button: ComponentOverrideDefinition<ButtonProps, ButtonProps>
  }
>

const {
  ToastIconSuccess,
  ToastIconError,
  HeaderIcon,
  InputFieldName,
  InputFieldEmail,
  Button,
} = getSectionOverrides(
  {
    ToastIconSuccess: UIIcon,
    ToastIconError: UIIcon,
    HeaderIcon: UIIcon,
    InputFieldName: UIInputField,
    InputFieldEmail: UIInputField,
    Button: UIButton,
  },
  override as NewsletterOverrideDefinition
)

export {
  ToastIconSuccess,
  ToastIconError,
  HeaderIcon,
  InputFieldName,
  InputFieldEmail,
  Button,
}
