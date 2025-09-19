import { useEffect } from 'react'
import useScreenResize from 'src/sdk/ui/useScreenResize'

export function useConnectorPositioning(
  containerRef: React.RefObject<HTMLDivElement>
) {
  const { isDesktop, isMobile, isTablet } = useScreenResize()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const calculateContainerGap = () => {
      // Get all steps
      const steps = container.querySelectorAll(
        '[data-fs-shipping-step]'
      ) as NodeListOf<HTMLElement>

      if (steps.length === 0) return

      // Get container width
      const containerWidth = container.offsetWidth

      // Calculate total step width
      let totalStepWidth = 0
      steps.forEach((step) => {
        totalStepWidth += step.offsetWidth
      })

      // Calculate gap width
      const numberOfGaps = steps.length - 1
      const totalGapSpace = containerWidth - totalStepWidth
      const gapWidth = totalGapSpace / numberOfGaps

      return gapWidth
    }

    const setUpConnectorPositioning = () => {
      const connectors = container.querySelectorAll(
        '[data-fs-shipping-connector]'
      ) as NodeListOf<HTMLElement>

      if (connectors.length === 0) return

      if (isDesktop) {
        const containerGap = calculateContainerGap()
        connectors.forEach((connector) => {
          connector.style.width = `calc(((50% - var(--fs-order-status-step-icon-half-size) - var(--fs-order-status-card-gap)) * 2) + ${containerGap}px)`
          connector.style.height = 'var(--fs-border-width)'
        })
      } else {
        connectors.forEach((connector) => {
          connector.style.width = 'var(--fs-border-width)'
          connector.style.height =
            'calc((50% - var(--fs-order-status-step-icon-half-size)) + var(--fs-order-status-card-gap) + (50% - var(--fs-order-status-step-icon-half-size)) - (var(--fs-order-status-connector-spacing) * 2))'
        })
      }
    }

    // Calculate on mount and window resize
    setUpConnectorPositioning()
    window.addEventListener('resize', setUpConnectorPositioning)

    return () => window.removeEventListener('resize', setUpConnectorPositioning)
  }, [containerRef, isDesktop])
}
