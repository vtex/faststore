import { Button } from '@faststore/ui'

import styles from './styles.module.css'

import React, { useState } from 'react'
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live'

import nightOwl from 'prism-react-renderer/themes/nightOwlLight'

const CodeIcon = () => (
    <svg className={styles.IconCode} viewBox="0 0 24 24" aria-hidden="true">
        <path fill="white" d="M8.7 15.9 4.8 12l3.9-3.9c.39-.39.39-1.01 0-1.4a.9839.9839 0 0 0-1.4 0l-4.59 4.59c-.39.39-.39 1.02 0 1.41l4.59 4.6c.39.39 1.01.39 1.4 0 .39-.39.39-1.01 0-1.4zm6.6 0 3.9-3.9-3.9-3.9a.9839.9839 0 0 1 0-1.4c.39-.39 1.01-.39 1.4 0l4.59 4.59c.39.39.39 1.02 0 1.41l-4.59 4.6c-.39.39-1.01.39-1.4 0a.9839.9839 0 0 1 0-1.4z"></path>
    </svg>
)

function LiveCode({ defaultShowCode, refreshPreview, onChangeCode }) {
    const [showCode, setShowCode] = useState(defaultShowCode)

    return (
        <div className={styles.playground}>
            <div className={styles.playgroundPreview}>
                <LivePreview />
            </div>
            {showCode && (
                <div className={styles.playgroundCode}>
                    <LiveEditor onChange={onChangeCode} />
                    <LiveError />
                </div>
            )}
            <div className={styles.playgroundControls}>
                <Button
                    className={styles.playgroundButton}
                    onClick={() => setShowCode((prevShowCode) => !prevShowCode)}
                >
                    <CodeIcon /> {showCode ? 'HIDE' : 'SHOW'} CODE
                </Button>
            </div>
        </div>
    )
}


function Playground({
    theme,
    transformCode,
    children,
    showCode: defaultShowCode = false,
    ...props
}) {
    const [, setCount] = useState(0)
    const [code, setCode] = useState(children.replace(/\n$/, ''))
    return (
        <LiveProvider
            transformCode={transformCode || ((codeString) => `${codeString};`)}
            theme= {nightOwl}
            code={code}
            {...props}
        >
            <LiveCode
                defaultShowCode={defaultShowCode}
                refreshPreview={() => setCount((prev) => prev + 1)}
                onChangeCode={(newCode) => setCode(newCode.replace(/\n$/, ''))}
            />
        </LiveProvider>
    )
}

export default Playground
