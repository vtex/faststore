import { useRef } from 'react'

import { useWebchatScript } from 'src/components/ThirdPartyScripts'

import Section from '../Section'

import styles from './section.module.scss'

const Webchat = () => {
  const scriptContainerRef = useRef<HTMLDivElement>(null)
  useWebchatScript(scriptContainerRef)

  return (
    <Section className={`${styles.section} section-webchat layout__section`}>
      <div ref={scriptContainerRef} aria-hidden="true" hidden />
    </Section>
  )
}

Webchat.$componentKey = 'Webchat'

export default Webchat
