import React, { useState } from 'react'
import { render } from 'react-dom'
import styles from './FeedbackForm.module.css'

class FeedbackForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      helpful: '',
      showForm: false,
      sendingMessage: false,
      messageSent: false,
      messageError: false,
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
    this.setState({
      showForm: true,
    })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    this.setState({
      sendingMessage: true,
    })
    this.sendMessage()
  }

  handleReturnButton = () => {
    this.setState({
      showForm: false,
      messageSent: false,
      messageError: false,
    })
  }

  sendMessage = () => {
    const apiUrl =
      'https://hooks.zapier.com/hooks/catch/10752880/b1pm58m/?message=' +
      this.state.message +
      '&timestamp=' +
      new Date().toLocaleString() +
      '&url=' +
      document.URL +
      '&helpful=' +
      this.state.helpful

    async function myFetch() {
      await fetch(apiUrl, {
        method: 'POST',
      })
    }

    myFetch()
      .then(() => {
        this.setState({
          messageSent: true,
          sendingMessage: false,
          message: '',
          helpful: '',
        })
      })
      .catch((err) => {
        console.log(err)
        this.setState({
          messageError: true,
          sendingMessage: false,
        })
      })
  }

  returnButton = () => (
    <button className={styles.submit} onClick={this.handleReturnButton}>
      Return
    </button>
  )

  render() {
    if (this.state.sendingMessage) {
      return <div>Sending...</div>
    }

    if (this.state.messageSent) {
      return (
        <React.Fragment>
          <div className={styles.submitMessage}>
            <h3>Thank you!</h3>
            <p>We appreciate your feedback.</p>
            {this.returnButton()}
          </div>
        </React.Fragment>
      )
    }

    if (this.state.messageError) {
      return (
        <React.Fragment>
          <div className={styles.submitMessage}>
            <h3>Sorry, an error ocurred.</h3>
            {this.returnButton()}
          </div>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <div className={styles.formRadio}>
          <label>Was this page helpful?</label>
          <label className={styles.yes}>
            <input
              id="yes"
              type="radio"
              name="helpful"
              value="Yes"
              checked={this.state.helpful === 'Yes'}
              onChange={this.handleChange}
            />
            <span className="fa fa-thumbs-up" aria-hidden="true"></span>
          </label>
          <label className={styles.no}>
            <input
              type="radio"
              name="helpful"
              value="No"
              checked={this.state.helpful === 'No'}
              onChange={this.handleChange}
            />
            <span className="fa fa-thumbs-down" aria-hidden="true"></span>
          </label>
        </div>

        {this.state.showForm === true && (
          <div className={styles.feedbackForm}>
            <p>Additional feedback</p>
            <form onSubmit={this.handleSubmit}>
              <textarea
                className={styles.formText}
                name="message"
                placeholder="How we can we improve your documentation and learning experience?"
                value={this.state.message}
                onChange={this.handleChange}
              />
              <div>
                <button className={styles.submit}>Skip this</button>
                <button className={styles.submit}>Submit</button>
              </div>
            </form>
          </div>
        )}
      </React.Fragment>
    )
  }
}

export default FeedbackForm
