import React from 'react'
import styles from './FaqPage.module.css'
import FaqQuestion from '../../../components/FaqQuestion/FaqQuestion'

const data = [
  {
    question: "What is FastStore?",
    answer: `
    Faststore is a fullstack toolkit that helps you develop your ecommerce experience. It is split into three modules (UI/SDK/API) that you can use individually or combine with other solutions on the Web. Use UI for easily adding accessibility ready components to your ecommerce. Use SDK to manage common states of your ecommerce, like optimistic cart, faceted search and user session. Finally, connect to your favorite ecommerce platform using API.

    To speed up your development, we also provide starters on your favorite React framework, like Gatsby and Next.JS featuring UI/SDK and API.
    `,
  },
  {
    question: "How I start a FastStore project?",
    answer: "The easiest way is to use one of our official starters. Find your favorite starter, fork it, customize it and deploy on your favorite Jamstack platform. Currently we suport VTEX WebOps, Netlify, Gatsby Cloud and Vercell"
  },
  {
    question: "Can I integrate my FastStore project with a CMS?",
    answer: `Headless CMS is a great way to empower business users and speed up your iteration time. Check out the list of <a href="https://jamstack.org/headless-cms/">supported headless CMS</a>`
  },
  {
    question: "Which tech stack do you recommend?",
    answer: `
    Faststore can run with any stack. However, for a better stability and performance, consider using Jamstack and deploying on VTEX WebOps, Netlify, Gatsby Cloud or Vercell.
    Also, runtime-based CSS-in-JS solutions tend to harm performance. Consider using a static CSS solution, like Tailwind, Less or raw CSS.
    `
  },
  {
    question: "Can I use Tachyons or other CSS frameworks?",
    answer: "UI is styled via data attributes. This means we are compatible with all major CSS frameworks, like emotion, tailwind, styled components, stichches etc"
  },
  {
    question: "Can I adapt UI components to my business needs?",
    answer: "UI uses the atomic desing principle. This means that you can use our atoms and molecules to create custom components tailored for your business needs"
  },
  {
    question: "How can I contribute to FastStore?",
    answer: "There are multiple ways to contribute to the project whether you are a technical or non technical user. Correct typos, fix translations, enhance documentation, improve componets, behaviors, submit new starters etc. Check out our contributions guide (comming soon)"
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
