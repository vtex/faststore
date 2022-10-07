import React from 'react'
import styles from './FeedbackModal.module.css'
import { v1 as uuidv1 } from 'uuid'

class FeedbackScanModal extends React.Component {
  constructor(props) {
    super(props)
    this.initialState = {
      currentStep: 1,
      id: '',
      email: '',
      followup: '',
      option: '',
      comment: '',
      showEmailForm: false,
    }
    this.state = this.initialState
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isOpen !== this.props.isOpen) {
      this.setState(() => this.initialState)
      this.setState({ id: uuidv1() })
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

  submitOption = (event) => {
    event.preventDefault()
    this.postRequest()
    let currentStep = this.state.currentStep
    currentStep = currentStep >= 1 ? 2 : currentStep + 1
    this.setState({
      currentStep: currentStep,
    })
  }

  submitComment = (event) => {
    event.preventDefault()
    this.postRequest()
    this.props.handleClose()
  }

  postRequest = () => {
    const bodyContent = {
      id: this.state.id,
      email: this.state.email,
      selection: this.props.selection,
      url: this.state.url,
      option: this.state.option,
      comment: this.state.comment,
    }

    async function myFetch() {
      await fetch('https://vtexhelp.myvtex.com/feedbackDatabase', {
        mode: 'no-cors',
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
          onSubmit={this.submitOption}
          onClick={this.props.onClick}
          option={this.state.option}
        />
        <Step2
          currentStep={this.state.currentStep}
          handleChange={this.handleChange}
          showForm={this.showForm}
          onClick={this.props.onClick}
          onSubmit={this.submitComment}
          showEmailForm={this.state.showEmailForm}
          comment={this.state.comment}
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
    <div className="w-80 overflow-auto h-max">
      <form onSubmit={props.onSubmit}>
        <p>What is the issue with this section?</p>
        <ul className="text-xs">
          <li>
            <div className="flex items-center">
              <input
                id="option-imprecise"
                type="radio"
                value="imprecise"
                name="option"
                className="hidden peer"
                checked={props.option === 'imprecise'}
                onChange={props.handleChange}
              />
              <label
                htmlFor="option-imprecise"
                className="w-full rounded mt-2 p-3 cursor-pointer border peer-checked:border-rebelPink peer-checked:text-rebelPink peer-checked:bg-tagHighlight hover:text-gray-600 hover:bg-gray-100"
              >
                <strong>Imprecise</strong> - doesn&rsquo;t match what&rsquo;s in
                my screen.
              </label>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <input
                id="option-hard-to-understand"
                type="radio"
                value="hard-to-understand"
                name="option"
                className="hidden peer"
                checked={props.option === 'hard-to-understand'}
                onChange={props.handleChange}
              />
              <label
                htmlFor="option-hard-to-understand"
                className="w-full rounded mt-2 p-3 cursor-pointer border peer-checked:border-rebelPink peer-checked:text-rebelPink peer-checked:bg-tagHighlight hover:text-gray-600 hover:bg-gray-100"
              >
                <strong>Hard to understand</strong> - unclear or difficult to
                comprehend.
              </label>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <input
                id="option-insufficient-info"
                type="radio"
                value="insufficient-info"
                name="option"
                className="hidden peer"
                checked={props.option === 'insufficient-info'}
                onChange={props.handleChange}
              />
              <label
                htmlFor="option-insufficient-info"
                className="w-full rounded mt-2 p-3 cursor-pointer border peer-checked:border-rebelPink peer-checked:text-rebelPink peer-checked:bg-tagHighlight hover:text-gray-600 hover:bg-gray-100"
              >
                <strong>Insufficient information</strong> - pertinent but
                incomplete.
              </label>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <input
                id="option-unrelated"
                type="radio"
                value="unrelated"
                name="option"
                className="hidden peer"
                checked={props.option === 'unrelated'}
                onChange={props.handleChange}
              />
              <label
                htmlFor="option-unrelated"
                className="w-full rounded mt-2 p-3 cursor-pointer border peer-checked:border-rebelPink peer-checked:text-rebelPink peer-checked:bg-tagHighlight hover:text-gray-600 hover:bg-gray-100"
              >
                <strong>Unrelated</strong> - doesn&rsquo;t match the title or my
                expectations.
              </label>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <input
                id="option-minor-errors"
                type="radio"
                value="minor-errors"
                name="option"
                className="hidden peer"
                checked={props.option === 'minor-errors'}
                onChange={props.handleChange}
              />
              <label
                htmlFor="option-minor-errors"
                className="w-full rounded mt-2 p-3 cursor-pointer border peer-checked:border-rebelPink peer-checked:text-rebelPink peer-checked:bg-tagHighlight hover:text-gray-600 hover:bg-gray-100"
              >
                <strong>Minor errors</strong> - grammatical and/or formatting
                issues.
              </label>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <input
                id="option-other"
                type="radio"
                value="other"
                name="option"
                className="hidden peer"
                checked={props.option === 'other'}
                onChange={props.handleChange}
              />
              <label
                htmlFor="option-other"
                className="w-full rounded my-2 p-3 cursor-pointer border peer-checked:border-rebelPink peer-checked:text-rebelPink peer-checked:bg-tagHighlight hover:text-gray-600 hover:bg-gray-100"
              >
                <strong>Other</strong> - content improvement ideas.
              </label>
            </div>
          </li>
        </ul>

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
    <div className="w-80 h-max overflow-auto">
      <div>
        <form className={styles.FeedbackModal} onSubmit={props.onSubmit}>
          <label>
            Anything else you’d like to share?
            <textarea
              name="comment"
              placeholder="(Optional)"
              rows="5"
              value={props.comment}
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
          <div>
            <input
              type="submit"
              value="Submit"
              className="hover:text-white mx-auto py-3 px-4 rounded text-white uppercase font-VTEXMedium text-sm bg-seriousBlack inline-block"
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default FeedbackScanModal
