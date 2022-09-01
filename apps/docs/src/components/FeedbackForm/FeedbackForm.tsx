import React from 'react'
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

  render() {
    if (this.state.sendingMessage) {
      return <div className={styles.submitMessage}>Sending...</div>
    }

    if (this.state.messageSent) {
      return (
        <React.Fragment>
          <div className={styles.submitMessage}>
            <h3>Thank you!</h3>
            <p>We appreciate your feedback.</p>
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
          <label>Was this helpful?</label>
          <label>
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
          <label>
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
          <form onSubmit={this.handleSubmit}>
            <textarea
              className={styles.formText}
              name="message"
              rows="4"
              placeholder="Any thoughts you'd like to share?"
              value={this.state.message}
              onChange={this.handleChange}
            />
            <div>
              <button className={styles.submit}>Skip this</button>
              <button className={styles.submit}>Submit</button>
            </div>
          </form>
        )}
      </React.Fragment>
    )
  }
}

export default FeedbackForm
