import React from 'react'
import styles from './FaqPage.module.css'
import FaqQuestion from '../../../components/FaqQuestion/FaqQuestion'

const data = [
  {
    question: "What is FastStore?",
    answer: `
FastStore is a full-stack toolkit composed of three independent packages <strong>(UI, SDK, and API)</strong> that help you create performant ecommerce experiences. Use <strong>FastStore UI</strong> to add accessibility-ready components to your ecommerce, <strong>FastStore SDK</strong> to manage the states related to your store behavior, and <strong>FastStore API</strong> to connect to your favorite ecommerce platform. Notice that you can use these three packages individually or combined with other solutions on the web. <br/><br/><em>Please refer to <a href="/reference/overview">our documentation</a> for more information.</em>
    `,
  },
  {
    question: "How I start a FastStore project?",
    answer: `The easiest way to start a FastStore project is to use one of our official starters. Find your favorite starter at our <a href="/starters">Starter Library</a>, fork it, customize it and deploy it on your favorite Jamstack platform.`
  },
  {
    question: "Can I integrate my FastStore project with a CMS?",
    answer: `Yes. Since FastStore is Jamstack-based, you can use any <a href="https://jamstack.org/headless-cms/">headless CMS</a> available for Jamstack. Notice that we strongly recommend using VTEX Headless CMS for VTEX projects.`
  },
  {
    question: "Which tech stack do you recommend?",
    answer: `
For styling, consider using a static CSS solution, such as Tailwind, Less, or raw CSS. Keep in mind that runtime-based CSS-in-JS solutions tend to harm performance. For deployment, consider using VTEX IO WebOps for better stability and performance.
    `
  },
  {
    question: "Can I use Tachyons or other CSS frameworks?",
    answer: "Yes. FastStore UI is styled via data attributes. This means we are compatible with all major CSS frameworks, such as Emotion, Tailwind, Styled components, Stitches, etc."
  },
  {
    question: "Can I adapt UI components to my business needs?",
    answer: "Yes, because all FastStore UI components are open source, you can simply copy the source code from Github and modify it to your liking if you need to extend their behavior in any way for your project."
  },
  {
    question: "How can I contribute to FastStore?",
    answer: "There are multiple ways to contribute to the project whether you are a technical or non-technical user: correct typos, fix translations, enhance documentation, create new starters, improve components and behaviors. <br/><em>Check out our contributions guide (coming soon).</em>"
  }
]

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
                  <a href="https://www.youtube.com/channel/UCReNhDqLOVL4edqENJ4k7Fg">
                    Office Hours
                  </a>
                </li>
                <li>
                  <a href="https://github.com/vtex/faststore/issues">Github Issues</a>
                </li>
                <li>
                  <a href="https://github.com/vtex/faststore/discussions">
                    Github Discussions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.contentFaq}>
          <h2>FastStore</h2>
          {data.map(({question, answer}) => (
            <FaqQuestion question={question} answer={answer}></FaqQuestion>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FaqPage
