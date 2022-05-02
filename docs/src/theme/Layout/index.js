/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import clsx from 'clsx';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import SkipToContent from '@theme/SkipToContent';
import AnnouncementBar from '@theme/AnnouncementBar';
import Navbar from '@theme/Navbar';
import Footer from '@theme/Footer';
import LayoutProviders from '@theme/LayoutProviders';
import LayoutHead from '@theme/LayoutHead';
import {ThemeClassNames, useKeyboardNavigation} from '@docusaurus/theme-common';
import ErrorPageContent from '@theme/ErrorPageContent';
import FeedbackButton from '../../components/FeedbackButton/FeedbackButton'
import './styles.css';
export default function Layout(props) {
  const {children, noFooter, wrapperClassName, pageClassName} = props;
  useKeyboardNavigation();
  return (
    <LayoutProviders>
      <LayoutHead {...props} />

      <SkipToContent />     

      <Navbar />

      <FeedbackButton />

      <AnnouncementBar />

      <div
        className={clsx(
          ThemeClassNames.wrapper.main,
          wrapperClassName,
          pageClassName,
        )}>
        <ErrorBoundary fallback={ErrorPageContent}>{children}</ErrorBoundary>
      </div>

      {!noFooter && <Footer />}
    </LayoutProviders>
  );
}
