'use client'

import {
  NewsletterProps as UINewsletterProps,
  NewsletterAddendumProps as UINewsletterAddendumProps,
  NewsletterHeaderProps as UINewsletterHeaderProps,
} from '@faststore/ui'

import UINewsletter from '../../ui/Newsletter'

import Section from '../Section'
import styles from './section.module.scss'
import { getOverridableSection } from '../../../../app/sdk/overrides/getOverriddenSection'
import { NewsletterDefaultComponents } from './DefaultComponents'

type SubscribeMessage = {
  icon: string
  title: string
  message: string
}

export interface NewsletterProps {
  /**
   * Title for the section.
   */
  title: UINewsletterHeaderProps['title']
  /**
   * The card Variant
   */
  card?: UINewsletterProps['card']
  /**
   * Specifies the component's color variant combination.
   */
  colorVariant?: UINewsletterProps['colorVariant']
  /**
   * A description for the section.
   */
  description?: UINewsletterHeaderProps['description']
  /**
   * The Privacy Policy disclaimer.
   */
  privacyPolicy?: UINewsletterAddendumProps['addendum']
  /**
   * The email input label.
   */
  emailInputLabel?: string
  /**
   * The name input visibility.
   */
  displayNameInput?: boolean
  /**
   * Icon for the section.
   */
  icon?: {
    alt: string
    icon: string
  }
  /**
   * The name input label.
   */
  nameInputLabel?: string
  /**
   * The subscribe button label.
   */
  subscribeButtonLabel?: string
  /**
   * The subscribe button loading label.
   */
  subscribeButtonLoadingLabel?: string
  /**
   * Toast attributes for successful subscriptions.
   */
  toastSubscribe?: SubscribeMessage
  /**
   * Toast attributes for unsuccessful subscriptions.
   */
  toastSubscribeError?: SubscribeMessage
}

function Newsletter({
  icon,
  title,
  description,
  privacyPolicy,
  emailInputLabel,
  displayNameInput,
  nameInputLabel,
  subscribeButtonLabel,
  subscribeButtonLoadingLabel,
  card,
  toastSubscribe,
  toastSubscribeError,
  colorVariant,
  ...otherProps
}: NewsletterProps) {
  return (
    <Section className={`${styles.section} section-newsletter layout__section`}>
      <UINewsletter
        icon={icon}
        title={title}
        description={description}
        privacyPolicy={privacyPolicy}
        emailInputLabel={emailInputLabel}
        displayNameInput={displayNameInput}
        nameInputLabel={nameInputLabel}
        subscribeButtonLabel={subscribeButtonLabel}
        subscribeButtonLoadingLabel={subscribeButtonLoadingLabel}
        toastSubscribe={toastSubscribe}
        toastSubscribeError={toastSubscribeError}
        card={card}
        colorVariant={colorVariant}
        {...otherProps}
      />
    </Section>
  )
}

const OverridableNewsletter = getOverridableSection<typeof Newsletter>(
  'Newsletter',
  Newsletter,
  NewsletterDefaultComponents
)

export default OverridableNewsletter
