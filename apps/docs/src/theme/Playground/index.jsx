/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import clsx from 'clsx'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { usePrismTheme } from '@docusaurus/theme-common'
import styles from './styles.module.css'
import useIsBrowser from '@docusaurus/useIsBrowser'

import {
  useCollapsibleCodeBlock,
  useCopyCodeBlock,
} from '../../components/CodeBlockWrapper'

function Header({ children }) {
  return <div className={clsx(styles.playgroundHeader)}>{children}</div>
}

function LivePreviewLoader() {
  // Is it worth improving/translating?
  return <div>Loading...</div>
}

function ResultWithHeader() {
  return (
    <>
      <div className={styles.playgroundPreview}>
        <BrowserOnly fallback={<LivePreviewLoader />}>
          {() => (
            <>
              <LivePreview />
              <LiveError />
            </>
          )}
        </BrowserOnly>
      </div>
    </>
  )
}

function ThemedLiveEditor() {
  const isBrowser = useIsBrowser()
  return (
    <LiveEditor
      // We force remount the editor on hydration,
      // otherwise dark prism theme is not applied
      key={isBrowser}
      className={styles.playgroundEditor}
    />
  )
}

function EditorWithHeader(props) {
  const { isCodeVisible, ToggleCodeButton } = useCollapsibleCodeBlock()
  const { CopyCodeButton } = useCopyCodeBlock(props.currentCode)

  return (
    <>
      {isCodeVisible && <ThemedLiveEditor />}
      <Header>
        <div className={styles.playgroundControls}>
          <ToggleCodeButton />
          {isCodeVisible && <CopyCodeButton code={props.currentCode} />}
          {isCodeVisible && (
            <button
              onClick={props.onRefresh}
              className={styles.playgroundButton}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 256 256"
                className={styles.IconCode}
              >
                <rect width="16rem" height="16rem" fill="none" />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={18}
                  d="M176.167 99.716h48v-48"
                />
                <path
                  d="M65.775 65.775a88 88 0 0 1 124.45 0l33.942 33.94M79.833 156.284h-48v48"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={18}
                />
                <path
                  d="M190.225 190.225a88 88 0 0 1-124.45 0l-33.942-33.94"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={18}
                />
              </svg>
              Refresh code
            </button>
          )}
        </div>
      </Header>
    </>
  )
}

export default function Playground({ children, ...props }) {
  const [currentCode, setCurrentCode] = React.useState(children)
  const prismTheme = usePrismTheme()

  const showEditor = props?.live && !props?.previewOnly

  const transformCode = (code) => {
    setCurrentCode(code)

    return `${code};`
  }

  const handleRefresh = () => {
    setCurrentCode(children)
  }

  return (
    <div className={styles.playgroundContainer}>
      <LiveProvider
        code={currentCode.replace(/\n$/, '')}
        transformCode={transformCode}
        theme={prismTheme}
        {...props}
      >
        <>
          <ResultWithHeader {...props} />
          {showEditor ? (
            <EditorWithHeader
              currentCode={currentCode}
              onRefresh={handleRefresh}
            />
          ) : null}
        </>
      </LiveProvider>
    </div>
  )
}
