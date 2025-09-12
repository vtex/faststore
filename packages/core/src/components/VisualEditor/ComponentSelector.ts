import type { ComponentData } from './types'

export class ComponentSelector {
  private isActive = false
  private overlay: HTMLDivElement | null = null
  private highlightedElement: HTMLElement | null = null
  private currentComponentKey: string | null = null

  constructor(
    private readonly onComponentSelect: (data: ComponentData) => void
  ) {
    this.createOverlay()
    this.init()
  }

  private createOverlay() {
    this.overlay = document.createElement('div')
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      background: transparent;
    `
    document.body.appendChild(this.overlay)
  }

  private init() {
    // Use capture phase to intercept all clicks before they bubble up
    document.addEventListener('click', this.handleClick, true)
    document.addEventListener('mouseover', this.handleMouseOver)
    document.addEventListener('mouseout', this.handleMouseOut)

    this.isActive = true
  }

  private readonly handleClick = (event: MouseEvent) => {
    if (!this.isActive) return

    // Prevent all clicks from causing navigation or default behavior
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()

    const target = event.target as HTMLElement
    const componentElement = this.findComponentElement(target)

    // Only trigger component selection if we found a component
    if (componentElement) {
      const componentKey = componentElement.dataset.componentKey
      const sectionName = componentElement.dataset.sectionName

      if (componentKey) {
        console.debug('[CMS VE] Component clicked:', componentKey)
        this.onComponentSelect({
          componentKey,
          sectionName: sectionName || componentKey,
          element: componentElement,
          data: {}, // TODO: add component data/props
        })
      }
    }
  }

  private readonly handleMouseOver = (event: MouseEvent) => {
    if (!this.isActive) return

    const target = event.target as HTMLElement
    const componentElement = this.findComponentElement(target)

    if (componentElement) {
      const componentKey = componentElement.dataset.componentKey

      if (componentKey && componentKey !== this.currentComponentKey) {
        this.currentComponentKey = componentKey
        this.addHighlight(componentElement)
      }
    }
  }

  private readonly handleMouseOut = (event: MouseEvent) => {
    if (!this.isActive) return

    const relatedTarget = event.relatedTarget as HTMLElement

    if (relatedTarget) {
      const newComponentElement = this.findComponentElement(relatedTarget)
      const newComponentKey = newComponentElement?.dataset.componentKey

      if (newComponentKey !== this.currentComponentKey) {
        this.currentComponentKey = null
        this.removeHighlight()
      }
    } else {
      // Mouse left the document area
      this.currentComponentKey = null
      this.removeHighlight()
    }
  }
  private findComponentElement(element: HTMLElement): HTMLElement | null {
    let current: HTMLElement | null = element

    while (current && current !== document.body) {
      if (current.dataset.componentKey) {
        return current
      }
      current = current.parentElement
    }

    return null
  }

  public highlightComponent(componentKey: string) {
    const element = document.querySelector(
      `[data-component-key="${componentKey}"]`
    ) as HTMLElement
    if (element) {
      this.addHighlight(element)
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  private addHighlight(element: HTMLElement) {
    this.removeHighlight()

    const rect = element.getBoundingClientRect()
    const highlightDiv = document.createElement('div')

    highlightDiv.style.cssText = `
      position: fixed;
      top: ${rect.top}px;
      left: ${rect.left}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      border: 2px solid #0066cc;
      background: rgba(0, 102, 204, 0.05);
      pointer-events: none;
      z-index: 10000;
      box-sizing: border-box;
      border-radius: 4px;
    `

    this.overlay?.appendChild(highlightDiv)
    this.highlightedElement = highlightDiv
  }

  private removeHighlight() {
    if (this.highlightedElement && this.overlay) {
      this.overlay.removeChild(this.highlightedElement)
      this.highlightedElement = null
    }
  }

  public destroy() {
    document.removeEventListener('click', this.handleClick, true)
    document.removeEventListener('mouseover', this.handleMouseOver)
    document.removeEventListener('mouseout', this.handleMouseOut)

    this.isActive = false

    if (this.overlay) {
      document.body.removeChild(this.overlay)
    }

    this.removeHighlight()
  }
}
