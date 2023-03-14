import {
  SlideOver,
  SlideOverHeader,
  SlideOverProps,
  useFadeEffect,
  useUI,
} from '@faststore/ui'

export type SlideOverUsageProps = Pick<SlideOverProps, "isOpen" | "size" | "direction">

const SlideOverUsage = ({ isOpen, size, direction }: SlideOverUsageProps) => {
  const { closeModal } = useUI()
  const { fade, fadeOut } = useFadeEffect()
  return (
    <SlideOver
      fade={fade}
      isOpen={isOpen}
      onDismiss={() => fadeOut()}
      size={props.size}
      direction={direction}
      onTransitionEnd={() => fade === 'out' && closeModal()}
    >
      <SlideOverHeader onClose={fadeOut}>
        <b>SlideOver</b>
      </SlideOverHeader>
      <main
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          height: '100%',
        }}
      >
        <p>
          A generic <code>SlideOver</code> component.
          <br></br>
          size:<code>{props.size}</code>
          <br></br>
          direction:<code>{props.direction}</code>
        </p>
      </main>
    </SlideOver>
  )
}

export default SlideOverUsage
