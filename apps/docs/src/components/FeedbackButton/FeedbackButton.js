import React, { useState } from 'react'

import FeedbackModal from '../FeedbackModal/FeedbackModal'
import styles from './FeedbackButton.module.css'
import { Modal } from '@faststore/ui'

function FeedbackButton() {
  const handleClose = () => setIsOpen(false)
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div>
      <button className={styles.float} onClick={() => setIsOpen(true)}>
        <i className="fas fa-comment-alt"> </i> Feedback
      </button>
      <Modal isOpen={isOpen} onDismiss={handleClose}>
        <FeedbackModal onClick={handleClose} />
      </Modal>
    </div>
  )
}

export default FeedbackButton
