import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { ComponentSelector } from './ComponentSelector'
import { PostMessageClient } from './PostMessageClient'
import type { VisualEditorResponse } from './types'

export function VisualEditorProvider(): React.ReactNode {
  const router = useRouter()

  useEffect(() => {
    // It only runs in iframe context and development mode
    if (typeof window === 'undefined' || window.parent === window) {
      return
    }

    // Check if CMS Visual Editor mode is active via URL param
    const isVisualEditorMode = new URLSearchParams(window.location.search).has(
      'visual-editor'
    )

    if (!isVisualEditorMode) {
      return
    }

    // Initialize PostMessage client
    const postMessageClient = new PostMessageClient({
      targetOrigin:
        process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '*', // TODO: Adjust to our preview server URL

      onMessage: (message: VisualEditorResponse) => {
        console.debug('[CMS VE] Received message from parent:', message)

        switch (message.type) {
          case 'INITIAL_DATA':
            console.debug('[CMS VE] Received initial data:', message.payload)
            break
          case 'COMPONENT_DATA':
            console.debug('[CMS VE] Component updated:', message.payload)
            // TODO: Update component data in the page
            break
          case 'SAVE_SUCCESS':
            console.debug('[CMS VE] CMS has been updated:', message.payload)
            // TODO: Handle a refresh or a visual feedback
            break
          case 'REFRESH_PREVIEW':
            console.debug('[CMS VE] Refresh the preview:', message.payload)
            // TODO: Handle a refresh
            break
          case 'ERROR':
            console.error(
              '[CMS VE] Error from CMS Visual Editor:',
              message.payload
            )
            break
        }
      },
    })

    // Initialize Component Selector
    const componentSelector = new ComponentSelector((componentData) => {
      console.debug('[CMS VE] Component selected:', componentData)

      postMessageClient.send({
        type: 'COMPONENT_SELECT',
        timestamp: Date.now(),
        sessionId: Math.random().toString(36).substring(7),
        payload: {
          componentKey: componentData.componentKey,
          componentType: componentData.sectionName,
          data: JSON.stringify(componentData.data),
        },
      })
    })

    return () => {
      postMessageClient.destroy()
      componentSelector.destroy()
    }
  }, [router])

  return null
}
