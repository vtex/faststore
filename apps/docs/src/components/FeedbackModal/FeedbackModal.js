import React, { useState } from 'react'
import styles from './FeedbackModal.module.css'
import { v1 as uuidv1 } from 'uuid'
import ReactGA from 'react-ga4'

class FeedbackModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStep: 1,
      id: uuidv1(),
      email: '',
      followup: '',
      rate: '',
      message: '',
      showEmailForm: false,
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState({
      [name]: value,
    })
  }

  showForm = (e, value) => {
    this.setState({
      showEmailForm: value,
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.onClick()
    this.sendMessage()
  }

  handleShare = (event) => {
    event.preventDefault()
    let currentStep = this.state.currentStep
    currentStep = currentStep >= 1 ? 2 : currentStep + 1
    this.setState({
      currentStep: currentStep,
    })
    this.sendMessage()
  }

  sendMessage = () => {
    const bodyContent = {
      id: this.state.id,
      timestamp: new Date().toLocaleString(),
      rate: this.state.rate,
      message: this.state.message,
      email: this.state.email,
    }

    ReactGA.initialize('G-MWFMZBZPHF')
    ReactGA.event({
      category: 'csat',
      action: 'csatVote',
      label: 'clickSubmitButton', // optional
      value: Number(bodyContent.rate), // optional, must be a number
      nonInteraction: false, // optional, true/false
      transport: 'xhr', // optional, beacon/xhr/image
    })

    async function myFetch() {
      await fetch('https://hooks.zapier.com/hooks/catch/10752880/bz0vk36/', {
        body: JSON.stringify(bodyContent),
        method: 'POST',
      })
    }

    myFetch()
  }

  render() {
    return (
      <React.Fragment>
        <Step1
          currentStep={this.state.currentStep}
          handleChange={this.handleChange}
          onSubmit={this.handleShare}
          onClick={this.props.onClick}
          rate={this.state.rate}
        />
        <Step2
          currentStep={this.state.currentStep}
          handleChange={this.handleChange}
          showForm={this.showForm}
          onClick={this.props.onClick}
          onSubmit={this.handleSubmit}
          showEmailForm={this.state.showEmailForm}
          message={this.state.message}
          email={this.state.email}
        />
      </React.Fragment>
    )
  }
}

function Step1(props) {
  if (props.currentStep !== 1) {
    return null
  }
  return (
    <div>
      <h1 className="text-lg font-bold">Take the survey!</h1>
      <form className={styles.FeedbackModal} onSubmit={props.onSubmit}>
        <p>
          How would you rate your experience with
          <br /> FastStore documentation as a whole?
        </p>
        <div className={styles.Csat}>
          <label>
            <input
              required
              type="radio"
              name="rate"
              value="1"
              checked={props.rate === '1'}
              onChange={props.handleChange}
            />
            <span className="far fa-sad-tear"></span>
          </label>
          <label>
            <input
              type="radio"
              name="rate"
              value="2"
              checked={props.rate === '2'}
              onChange={props.handleChange}
            />
            <span className="far fa-frown-open"></span>
          </label>
          <label>
            <input
              type="radio"
              name="rate"
              value="3"
              checked={props.rate === '3'}
              onChange={props.handleChange}
            />
            <span className="far fa-meh"></span>{' '}
          </label>
          <label>
            <input
              type="radio"
              name="rate"
              value="4"
              checked={props.rate === '4'}
              onChange={props.handleChange}
            />
            <span className="far fa-smile"></span>
          </label>
          <label>
            <input
              type="radio"
              name="rate"
              value="5"
              checked={props.rate === '5'}
              onChange={props.handleChange}
            />
            <span className="far fa-grin"></span>
          </label>
        </div>

        <div>
          <input
            type="submit"
            value="Submit"
            className="hover:text-white mx-auto py-3 px-4 rounded text-white uppercase font-VTEXMedium text-sm bg-seriousBlack inline-block"
          />
        </div>
      </form>
    </div>
  )
}

function Step2(props) {
  if (props.currentStep !== 2) {
    return null
  }
  return (
    <div>
      <div className={styles.Feedback}>
        <img src="https://vtexhelp.vtexassets.com/assets/docs/src/thankYou___b4ba01a2ad384f246d3fc2bd5a96dc3a.jpg" />
        <h3 className="text-2xl font-bold text-center mt-4 mb-4">
          Thanks for your feedback!
        </h3>
        <form className={styles.FeedbackModal} onSubmit={props.onSubmit}>
          <label>
            Anything else you’d like to share?
            <textarea
              className={styles.formText}
              name="message"
              placeholder="(Optional)"
              rows="3"
              value={props.message}
              onChange={props.handleChange}
            />
          </label>
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
                  onChange={(e) => props.showForm(e, true)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="followup"
                  value="No"
                  onChange={(e) => props.showForm(e, false)}
                />
                No
              </label>
            </div>
          </label>

          {props.showEmailForm === true && (
            <label>
              Contact Email
              <input
                required
                placeholder="john@email.com"
                type="email"
                name="email"
                value={props.email}
                onChange={props.handleChange}
              />
            </label>
          )}

          <input
            type="submit"
            value="Submit"
            className="hover:text-white mx-auto py-3 px-4 rounded text-white uppercase font-VTEXMedium text-sm bg-seriousBlack inline-block"
          />
        </form>
      </div>
    </div>
  )
}

export default FeedbackModal
