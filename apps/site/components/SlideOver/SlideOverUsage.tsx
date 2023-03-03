import {
  SlideOver,
  SlideOverHeader,
  useFadeEffect,
  SlideOverProps,
} from '@faststore/ui'

export type SlideOverUsageProps = {
  isOpen: SlideOverProps['isOpen']
  size: SlideOverProps['size']
  direction: SlideOverProps['direction']
}

const SlideOverUsage = (props: SlideOverUsageProps) => {
  const { fade, fadeOut } = useFadeEffect()
  return (
    <SlideOver
      fade={fade}
      isOpen={props.isOpen}
      onDismiss={() => fadeOut()}
      size={props.size}
      direction={props.direction}
      onTransitionEnd={() => fade === 'out'}
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
