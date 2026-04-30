import { useRef } from 'react'

import { useShoppingAssistant } from 'src/components/ThirdPartyScripts'

import Section from '../Section'

import styles from './section.module.scss'

const ShoppingAssistant = () => {
  const scriptContainerRef = useRef<HTMLDivElement>(null)
  useShoppingAssistant(scriptContainerRef)

  return (
    <Section
      className={`${styles.section} section-shopping-assistant layout__section`}
    >
      <div ref={scriptContainerRef} aria-hidden="true" hidden />
    </Section>
  )
}

ShoppingAssistant.$componentKey = 'ShoppingAssistant'

export default ShoppingAssistant
