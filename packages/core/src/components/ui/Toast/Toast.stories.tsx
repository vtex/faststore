import { UIProvider } from '@faststore/sdk'

import { useUI, uiActions, uiEffects, uiInitialState } from 'src/sdk/ui'

import Toast from '.'

const story = {
  component: Toast,
  title: 'Atoms/Toast',
}

const Template = () => {
  const { pushToast } = useUI()

  return (
    <div
      style={{
        padding: 20,
        width: '100%',
        height: '40vh',
        backgroundColor: 'black',
      }}
    >
      <button
        style={{ width: 130 }}
        onClick={() => {
          pushToast({
            title: 'Your cart was updated',
            message: 'Some additional info here',
            status: 'INFO',
            icon: 'ArrowsClockwise',
          })
        }}
      >
        Display toast
      </button>
    </div>
  )
}

const TemplateWithProvider = () => {
  return (
    <UIProvider
      initialState={uiInitialState}
      actions={uiActions}
      effects={uiEffects}
    >
      <Toast />
      <Template />
    </UIProvider>
  )
}

export const Default = TemplateWithProvider.bind({})

Default.args = {}

export default story
