import React, { useState } from 'react'
import styles from './StarterSubmissionForm.module.css'

function StarterSubmissionForm() {
  const [ContactEmail, setEmail] = useState('')
  const [GitHubRepo, setGitHubRepo] = useState('')
  const [DemoURL, setDemoURL] = useState('')
  const [DemoScreenshot, setDemoScreenshot] = useState('')
  const [Description, setDescription] = useState('')
  const [Features, setFeatures] = useState('')
  const [textAreaCount, setCount] = useState(0)
  const [isSent, setIsSent] = useState(false)
  const bodyContent = {
    ContactEmail: ContactEmail,
    GitHubRepo: GitHubRepo,
    DemoURL: DemoURL,
    DemoScreenshot: DemoScreenshot,
    Description: Description,
    Features: Features,
  }
  const submitStarter = async (event) => {
    event.preventDefault()

    const res = await fetch(
      'https://hooks.zapier.com/hooks/catch/10752880/bzqwccz/',
      {
        body: JSON.stringify(bodyContent),
        method: 'POST',
      }
    )
      .then(() => setIsSent(true))
      .catch(() => alert('There was an error, please try again'))
  }
  const thankYouMessage = (
    <p className="text-seriousBlack">
      Thank you for submitting your Starter! {"We'll"} get in touch with you as
      soon as possible!
    </p>
  )
  const form = (
    <form className={styles.submissionForm} onSubmit={submitStarter}>
      <label htmlFor="ContactEmail">Contact Email</label>
      <input
        required
        placeholder="john@email.com"
        type="email"
        name="email"
        value={ContactEmail}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="GitHubRepo">Github repository URL</label>
      <input
        required
        placeholder="https://github.com/vtex-sites/gatsby.store"
        type="url"
        name="GitHubRepo"
        value={GitHubRepo}
        onChange={(e) => setGitHubRepo(e.target.value)}
      />
      <label htmlFor="DemoURL">Demo URL</label>
      <input
        required
        placeholder="https://base.vtex.app/"
        type="url"
        name="DemoURL"
        value={DemoURL}
        onChange={(e) => setDemoURL(e.target.value)}
      />
      <label htmlFor="DemoScreenshot">Demo screenshot URL</label>
      <input
        required
        placeholder="Demo screenshot URL"
        type="url"
        name="DemoScreenshot"
        value={DemoScreenshot}
        onChange={(e) => setDemoScreenshot(e.target.value)}
      />
      <label htmlFor="Description">
        Description of Starter ({textAreaCount}/200)
      </label>
      <textarea
        required
        maxLength="200"
        placeholder="Description of Starter (Content limited to 200 characters)"
        name="Description"
        value={Description}
        onChange={(e) => {
          setDescription(e.target.value)
          setCount(e.target.value.length)
        }}
      />
      <label htmlFor="Features">Significant features (1 per line)</label>
      <textarea
        required
        maxLength="200"
        placeholder="Features"
        name="Features"
        value={Features}
        onChange={(e) => setFeatures(e.target.value)}
      />

      <button
        type="submit"
        className="hover:text-white mx-auto mt-4 py-3 px-4 rounded text-white uppercase font-VTEXMedium text-sm bg-seriousBlack inline-block"
      >
        SUBMIT STARTER
      </button>
    </form>
  )
  return isSent ? thankYouMessage : form
}

export default StarterSubmissionForm
