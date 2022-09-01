import React from 'react'
import FeedbackScanModal from '../../components/FeedbackScanModal/FeedbackScanModal'
import clsx from 'clsx'

class FeedbackScan extends React.Component {
  state = {
    isOpen: false,
    Ypos: 0,
    selectedDiv: '',
  }

  showModal = () => {
    const tooltip = document.getElementById('tooltip')
    const hiddenModal = document.getElementById('hidden-modal')
    this.setState({ isOpen: true })
    this.handleModalPosition(
      hiddenModal,
      this.state.selectedDiv.getBoundingClientRect().top
    )
    this.state.selectedDiv.classList.add('bg-tagHighlight')
    tooltip.style.visibility = 'hidden'
  }

  // Reads the mouse position and updates the button position accordingly
  handleModalPosition = (divElement, Ypos) => {
    const container = document.getElementsByClassName('theme-doc-markdown')[0]
    const width = divElement.offsetWidth
    const Xpos =
      container.getBoundingClientRect().left +
      container.getBoundingClientRect().width
    const height = divElement.offsetHeight

    if (Ypos + height > window.innerHeight) {
      divElement.style.bottom = '2%'
    } else {
      divElement.style.top = Ypos + 'px'
    }

    if (Xpos + width > window.innerWidth) {
      divElement.style.right = '2%'
    } else {
      divElement.style.left = Xpos + 'px'
    }
  }

  hideModal = () => {
    this.setState({ isOpen: false })
    const hiddenModal = document.getElementById('hidden-modal')
    hiddenModal.style.top = null
    hiddenModal.style.bottom = null
    hiddenModal.style.left = null
    hiddenModal.style.right = null
    if (this.state.selectedDiv != undefined) {
      this.state.selectedDiv.classList.remove('bg-tagHighlight')
    }
  }

  // Highlights div and shows the button when mouse enters div
  onMouseOverDiv = (e) => {
    const acceptedDivTypes = ['P', 'LI', 'H1', 'H2', 'H3', 'H4', 'PRE', 'CODE']
    const feedbackScanner = document.getElementById('feedback-scan')
    var { target } = e
    if (acceptedDivTypes.includes(target.parentElement.nodeName)) {
      target = target.parentElement
      this.setState({
        selectedDiv: target,
      })
    }
    if (acceptedDivTypes.includes(target.nodeName)) {
      target.classList.add('bg-code')
      this.setState({
        Ypos: target.offsetTop + target.offsetHeight / 2 - 12,
      })
      this.handleDivPosition(feedbackScanner, this.state.Ypos)
      this.setState({
        selectedDiv: target,
      })
    }
  }

  onMouseOutDiv = (e) => {
    var { target } = e
    const acceptedDivTypes = ['P', 'LI', 'H1', 'H2', 'H3', 'H4', 'PRE', 'CODE']
    if (acceptedDivTypes.includes(target.parentElement.nodeName)) {
      target = target.parentElement
      target.classList.remove('bg-code')
    }
    if (acceptedDivTypes.includes(target.nodeName)) {
      target.classList.remove('bg-code')
    }
  }

  // Reads the mouse position and updates the button position accordingly
  handleDivPosition = (divElement, Ypos) => {
    divElement.style.visibility = 'visible'
    divElement.style.top = Ypos + 'px'
  }

  handleFeature = () => {
    const article = document.getElementsByTagName('article')[0]
    const markdown = document.getElementsByClassName('theme-doc-markdown')[0]
    const hiddenButton = document.getElementById('hidden-button')
    const tooltip = document.getElementById('tooltip')
    markdown.addEventListener('mouseover', this.onMouseOverDiv)
    markdown.addEventListener('mouseout', this.onMouseOutDiv)
    addEventListener('resize', this.hideModal)
    tooltip.style.visibility = 'visible'
    hiddenButton.style.visibility = 'visible'

    const feedbackScanner = document.getElementById('feedback-scan')
    article.classList.add('relative')
    article.appendChild(feedbackScanner)
    feedbackScanner.classList.remove('hidden')
  }

  disableFeature = () => {
    const hiddenButton = document.getElementById('hidden-button')
    const article = document.getElementsByClassName('theme-doc-markdown')[0]
    article.removeEventListener('mouseover', this.onMouseOverDiv)
    article.removeEventListener('mouseout', this.onMouseOutDiv)
    const elements = article.querySelectorAll('.bg-code')
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove('bg-code')
    }
    hiddenButton.style.visibility = 'hidden'
  }

  render() {
    return (
      <div>
        <div id="feedback-scan" className="absolute hidden -right-10 top-0">
          <Modal
            isOpen={this.state.isOpen}
            handleClose={this.hideModal}
            disableFeature={this.disableFeature}
          >
            <FeedbackScanModal
              isOpen={this.state.isOpen}
              handleClose={this.hideModal}
              selection={this.state.selectedDiv.innerHTML}
            />
          </Modal>
          <button
            id="hidden-button"
            style={{
              visibility: 'hidden',
            }}
            className="ml-2"
            type="button"
            onClick={this.showModal}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 45 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M39.9634 0.333374H5.29671C2.89171 0.333374 0.963379 2.26171 0.963379 4.66671V30.6667C0.963379 31.816 1.41993 32.9182 2.23258 33.7308C3.04524 34.5435 4.14744 35 5.29671 35H13.9634V41.5C13.9634 42.6917 14.9384 43.6667 16.13 43.6667H17.2134C17.755 43.6667 18.2967 43.45 18.73 43.0384L26.7467 35H39.9634C42.3467 35 44.2967 33.05 44.2967 30.6667V4.66671C44.2967 3.51744 43.8402 2.41524 43.0275 1.60258C42.2149 0.78992 41.1127 0.333374 39.9634 0.333374ZM16.3034 28.5H11.7967V23.9717L25.165 10.56L29.65 15.0667L16.3034 28.5ZM33.1167 11.6L30.9284 13.7884L26.4434 9.39004L28.6317 7.18004C29.065 6.72504 29.8017 6.70337 30.3217 7.18004L33.1167 9.88837C33.5717 10.3434 33.5934 11.08 33.1167 11.6V11.6Z"
                fill="#F71963"
              />
            </svg>
            <span
              id="tooltip"
              style={{
                visibility: 'hidden',
              }}
              className="mt-2 z-50 absolute bg-whiteIce rounded-md text-xs text-text p-2 w-32 left-0 shadow"
            >
              Choose a section to give feedback on
            </span>
          </button>
        </div>

        <button
          onClick={this.handleFeature}
          className="hover:text-rebelPink text-xs whitespace-nowrap"
        >
          <i className="far fa-edit"></i> Suggest edits
        </button>
      </div>
    )
  }
}

const Modal = ({ handleClose, isOpen, children, disableFeature }) => {
  const showHideClassName = isOpen ? 'visible' : 'invisible'
  return (
    <div
      className={clsx(
        showHideClassName,
        'fixed z-50 top-0 left-0 w-screen h-screen'
      )}
      onClick={handleClose}
    >
      <section
        className="border rounded-md shadow absolute p-5 bg-background ml-14 h-min w-max"
        id="hidden-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            handleClose(), disableFeature()
          }}
          className="float-right"
          id="close-modal"
        >
          ⨉
        </button>
        {children}
      </section>
    </div>
  )
}

export default FeedbackScan
