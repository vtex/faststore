# UI Provider
This component should be used to control any UI side effects your UI may have. An example is having a global state for the minicart so we can open it when the user clicks on the buyButton. 

Trying to predict all possible UI global states is impossible, so we provide a way of extending the possible global states by providing a custom reducer and initial state.

## Custom global state
To provide your custom global state, just define a custom reducer and initial state

```tsx
import { UIState, IUAction } from '@vtex/store-sdk'

type Action = 
  | UIAction 
  | { type: 'OPEN_MODAL' } 
  | { type: 'CLOSE_MODAL' }

interface State extends UIState {
  displayModal: boolean
}

const initialState: State = {
  displayMinicart: false,
  displayModal: false
}

const reducer = () => {}
```
