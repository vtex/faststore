import React from 'react'
import styles from './FaqPage.module.css'
import FaqQuestion from '../../../components/FaqQuestion/FaqQuestion'

const FaqPage = () => {
  return (
    <div className={styles.FaqPage}>
      <div className={styles.sectionContent}>
        <div className={styles.FaqHeader}>
          <div>
            <h3> Frequently Asked Questions</h3>
            <br/>
            <div>
              <h2>Didn't find your answers?</h2> Don’t hesitate to get in touch! Find us at:
              <ul>
                <li>
                  <a href="https://community.vtex.com/">VTEX Community</a>
                </li>
                <li>
                  <a href="https://www.youtube.com/channel/UCReNhDqLOVL4edqENJ4k7Fg">
                    Office Hours
                  </a>
                </li>
                <li>
                  <a href="https://support.vtex.com/hc/en-us/requests">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.contentFaq}>
          <h2>FastStore</h2>
          <FaqQuestion
            question="What is FastStore?"
            answer="Teste"
          />
          <FaqQuestion
            question="What is the difference between FastStore and Store Framework?"
            answer=""
          />
          <FaqQuestion
            question="How I start a FastStore project?"
            answer=""
          />
          <FaqQuestion
            question="Can I integrate my FastStore project with a CMS?"
            answer=""
          />
          <FaqQuestion
            question="Which tech stack do you recommend?"
            answer=""
          />
          <FaqQuestion
            question="Can I use Tachyons or other CSS frameworks?"
            answer=""
          />
          <FaqQuestion
            question="Can I adapt FastStore UI components to my business needs?"
            answer=""
          />
          <FaqQuestion
            question="How can I contribute to FastStore?"
            answer=""
          />
          <h2>VTEX Headless CMS</h2>
          <FaqQuestion
            question="What is VTEX Headless CMS?"
            answer=""
          />
          <FaqQuestion
            question="Why should I use VTEX Headless CMS?"
            answer=""
          />
          <FaqQuestion
            question="What types of pages editors can create?"
            answer=""
          />
          <FaqQuestion
            question="Can I add my own components to the CMS?"
            answer=""
          />
          <h2>VTEX IO WebOps</h2>
          <FaqQuestion
            question="What is VTEX IO WebOps?"
            answer=""
          />
          <FaqQuestion
            question="Why should I use VTEX IO WebOps?"
            answer=""
          />
          <FaqQuestion
            question="What are the bots running in my Pull Request?"
            answer=""
          />
          <FaqQuestion
            question="Why the Lighthouse bot is failing?"
            answer=""
          />
          <FaqQuestion
            question="Can I customize the CI/CD pipeline?"
            answer=""
          />
        </div>
      </div>
    </div>
  )
}

export default FaqPage
