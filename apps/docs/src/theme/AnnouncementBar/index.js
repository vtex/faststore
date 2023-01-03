/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState } from 'react'
import clsx from 'clsx'
import { useThemeConfig, useAnnouncementBar } from '@docusaurus/theme-common'
import { translate } from '@docusaurus/Translate'
import IconClose from '@theme/IconClose'
import styles from './styles.module.css'
import FeedbackModal from '../../components/FeedbackModal/FeedbackModal'
import { Modal } from '@faststore/ui'
export default function AnnouncementBar() {
  const handleClose = () => setIsOpen(false)
  const [isOpen, setIsOpen] = useState(false)
  const { isActive, close } = useAnnouncementBar()
  const { announcementBar } = useThemeConfig()

  if (!isActive) {
    return null
  }

  const { content, backgroundColor, textColor, isCloseable } = announcementBar
  return (
    <div
      className={styles.announcementBar}
      style={{
        backgroundColor,
        color: textColor,
      }}
      role="banner"
    >
      {isCloseable && <div className={styles.announcementBarPlaceholder} />}
      <div className={styles.announcementBarContent}>
        <div
          className="inline pr-1"
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />
        <div className="inline text-rebelPink">
          <button onClick={() => setIsOpen(true)}>Take the survey!</button>
          <Modal isOpen={isOpen} onDismiss={handleClose}>
            <FeedbackModal
              onClick={() => {
                handleClose
                close()
              }}
            />
          </Modal>
        </div>
      </div>
      {isCloseable ? (
        <button
          type="button"
          className={clsx('clean-btn close', styles.announcementBarClose)}
          onClick={close}
          aria-label={translate({
            id: 'theme.AnnouncementBar.closeButtonAriaLabel',
            message: 'Close',
            description: 'The ARIA label for close button of announcement bar',
          })}
        >
          <IconClose width={14} height={14} strokeWidth={3.1} />
        </button>
      ) : null}
    </div>
  )
}
