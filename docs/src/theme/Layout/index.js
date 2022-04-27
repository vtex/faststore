/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react'
import clsx from 'clsx'
import ErrorBoundary from '@docusaurus/ErrorBoundary'
import SkipToContent from '@theme/SkipToContent'
import AnnouncementBar from '@theme/AnnouncementBar'
import Navbar from '@theme/Navbar'
import Footer from '@theme/Footer'
import LayoutProviders from '@theme/LayoutProviders'
import FeedbackButton from '../../components/FeedbackButton/FeedbackButton'
import {
  PageMetadata,
  ThemeClassNames,
  useKeyboardNavigation,
} from '@docusaurus/theme-common'
import ErrorPageContent from '@theme/ErrorPageContent'
import './styles.css'
export default function Layout(props) {
  const {
    children,
    noFooter,
    wrapperClassName,
    // not really layout-related, but kept for convenience/retro-compatibility
    title,
    description,
  } = props
  useKeyboardNavigation()

  return (
    <LayoutProviders>
      <PageMetadata title={title} description={description} />

      <SkipToContent />

      <Navbar />

      {localStorage.getItem('csat-submit-1') != "true" && (
        <>
          <AnnouncementBar />
          <FeedbackButton />
        </>
      )}

      <div className={clsx(ThemeClassNames.wrapper.main, wrapperClassName)}>
        <ErrorBoundary fallback={ErrorPageContent}>{children}</ErrorBoundary>
      </div>

      {!noFooter && <Footer />}
    </LayoutProviders>
  )
}
