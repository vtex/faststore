import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { PropsWithChildren } from 'react'

type FadeType = 'in' | 'out' | undefined

interface BaseContextValue {
  fade: FadeType
  onModalOpen: () => void
  onModalClose: () => void
  isRegionalizationModalOpen: boolean
  setIsRegionalizationModalOpen: (state: boolean) => void
}

type ContextValue = Record<string, unknown> & BaseContextValue

const ModalContext = createContext<ContextValue | undefined>(undefined)

function ModalProvider({ children }: PropsWithChildren<unknown>) {
  const [isRegionalizationModalOpen, setIsRegionalizationModalOpen] =
    useState(false)

  const [fade, setFade] = useState<FadeType>('out')
  const layout = useRef<HTMLElement | null>(null)

  const onModalOpen = useCallback(() => {
    setFade('in')
    layout.current?.classList.add('no-scroll')
  }, [])

  const onModalClose = useCallback(() => {
    setFade('out')
    layout.current?.classList.remove('no-scroll')
  }, [])

  useEffect(() => {
    layout.current = document.body

    return () => {
      layout.current?.classList.remove('no-scroll')
    }
  }, [])

  const value = useMemo(
    () => ({
      fade,
      onModalOpen,
      onModalClose,
      isRegionalizationModalOpen,
      setIsRegionalizationModalOpen,
    }),
    [
      fade,
      onModalOpen,
      onModalClose,
      isRegionalizationModalOpen,
      setIsRegionalizationModalOpen,
    ]
  )

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}

export function useModal() {
  const context = useContext(ModalContext)

  if (context === undefined) {
    throw new Error('Do not use Modal outside the Modal context.')
  }

  return context
}

export default ModalProvider
