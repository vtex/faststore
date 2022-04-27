import React, { useState } from 'react'
import styles from './FeedbackModal.module.css'
import { v1 as uuidv1 } from 'uuid'

class FeedbackModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: uuidv1(),
      email: '',
      followup: '',
      rate: '',
      message: '',
      showEmailForm: false,
      sendingMessage: false,
      messageSent: false,
      feedbackSent: false,
      messageError: false,
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleShare = async (e) => {
    e.preventDefault()
    this.setState({
      sendingMessage: true,
    })
    this.sendMessage()
  }

  sendMessage = () => {
    const bodyContent = {
      id: this.state.id,
      timestamp: new Date().toLocaleString(),
      email: this.state.email,
      rate: this.state.rate,
      message: this.state.message,
    }

    async function myFetch() {
      await fetch('https://hooks.zapier.com/hooks/catch/10752880/bz0vk36/', {
        body: JSON.stringify(bodyContent),
        method: 'POST',
      })
    }

    myFetch()
      .then(() => {
        this.setState({
          messageSent: true,
          sendingMessage: false,
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

  handleSubmitFollowUp = async (e) => {
    e.preventDefault()
    this.setState({
      sendingMessage: true,
    })
    this.sendFeedback()
  }

  sendFeedback = () => {
    const bodyContent = {
      id: this.state.id,
      email: this.state.email,
    }

    async function myFetch() {
      await fetch('https://hooks.zapier.com/hooks/catch/10752880/bz0vk36/', {
        body: JSON.stringify(bodyContent),
        method: 'POST',
      })
    }

    myFetch()
      .then(() => {
        this.setState({
          feedbackSent: true,
          sendingMessage: false,
        })
      })
      .catch((err) => {
        console.log(err)
        this.setState({
          feedbackSent: true,
          sendingMessage: false,
        })
      })
  }

  render() {
    if (this.state.sendingMessage) {
      return <div>Sending...</div>
    }


    if (this.state.messageSent) {
      return (
        <React.Fragment>
          <div className={styles.Feedback}>
              <img src='https://appliancetheme.vtexassets.com/assets/app/src/VTW_developers_landing___93c710d6223cc11e608a6e819a9aa19b.svg'/>
            <h3 className="text-2xl font-bold text-center mt-12">
              Thanks for sharing your feedback!
            </h3>
            <form
              className={styles.FeedbackModal}
              onSubmit={this.handleSubmitFollowUp}
            >
              <label>
                Can we reach out to you if we have any questions?
                <div className={styles.FollowUp}>
                  <label>
                    <input
                      required
                      id="yes"
                      type="radio"
                      name="followup"
                      value="Yes"
                      checked={this.state.followup === 'Yes'}
                      onChange={(e) => {
                        this.setState({
                          showEmailForm: true,
                        })
                        this.handleChange(e)
                      }}
                      />
                      Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="followup"
                      value="No"
                      checked={this.state.followup === 'No'}
                      onChange={(e) => {
                        this.setState({
                          showEmailForm: false,
                        })
                        this.handleChange(e)
                      }}
                    />
                    No
                  </label>
                </div>
              </label>

              {this.state.showEmailForm === true && (
                <label>
                  Contact Email
                  <input
                    required
                    placeholder="john@email.com"
                    type="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                </label>
              )}
              <input
                type="submit"
                value="Submit"
                className="hover:text-white mx-auto py-3 px-4 rounded text-white uppercase font-VTEXMedium text-sm bg-secondary inline-block"
              />
            </form>
          </div>
        </React.Fragment>
      )
    }

    if (this.state.messageError) {
      return (
        <React.Fragment>
          <div>
            <h3>Sorry, an error ocurred.</h3>
          </div>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <h1 className="text-lg font-bold">Give your feedback!</h1>
        <form className={styles.FeedbackModal} onSubmit={this.handleShare}>
          <p>
            How would you rate your experience with
            <br /> FastStore documentation?
          </p>
          <div className={styles.Csat}>
            <label>
              <input
                required
                type="radio"
                name="rate"
                value="1"
                checked={this.state.rate === '1'}
                onChange={this.handleChange}
              />
              <span className="far fa-sad-tear"></span>
            </label>
            <label>
              <input
                type="radio"
                name="rate"
                value="2"
                checked={this.state.rate === '2'}
                onChange={this.handleChange}
              />
              <span className="far fa-frown-open"></span>
            </label>
            <label>
              <input
                type="radio"
                name="rate"
                value="3"
                checked={this.state.rate === '3'}
                onChange={this.handleChange}
              />
              <span className="far fa-meh"></span>{' '}
            </label>
            <label>
              <input
                type="radio"
                name="rate"
                value="4"
                checked={this.state.rate === '4'}
                onChange={this.handleChange}
              />
              <span className="far fa-smile"></span>
            </label>
            <label>
              <input
                type="radio"
                name="rate"
                value="5"
                checked={this.state.rate === '5'}
                onChange={this.handleChange}
              />
              <span className="far fa-grin"></span>
            </label>
          </div>

          <label>
            Anything else you’d like to share?
            <textarea
              className={styles.formText}
              name="message"
              placeholder="(Optional)"
              rows="3"
              value={this.state.message}
              onChange={this.handleChange}
            />
          </label>

          <div>
            <input
              type="submit"
              value="Share"
              className="hover:text-white mx-auto py-3 px-4 rounded text-white uppercase font-VTEXMedium text-sm bg-secondary inline-block"
            />
          </div>
        </form>
      </React.Fragment>
    )
  }
}

export default FeedbackModal
