import UINewsletter, {
  NewsletterProps as UINewsletterProps,
} from 'src/components/ui/Newsletter'

import Section from '../Section'
import styles from './section.module.scss'

const Newsletter = function Newsletter({
  icon,
  title,
  description,
  privacyPolicy,
  emailInputLabel,
  displayNameInput,
  nameInputLabel,
  subscribeButtonLabel,
  card,
  ...otherProps
}: UINewsletterProps) {
  return (
    <Section className={`${styles.section} section-newsletter`}>
      <UINewsletter
        icon={icon}
        title={title}
        description={description}
        privacyPolicy={privacyPolicy}
        emailInputLabel={emailInputLabel}
        displayNameInput={displayNameInput}
        nameInputLabel={nameInputLabel}
        subscribeButtonLabel={subscribeButtonLabel}
        card={card}
        {...otherProps}
      />
    </Section>
  )
}

export default Newsletter
