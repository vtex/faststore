# UI Provider
This component should be used to control any UI side effects your UI may have. An example is having a global state for the minicart so we can open it when the user clicks on the buyButton. 

Trying to predict all possible UI global states is impossible, so if you need custom global states, you can replace our provider and add your own. Just make sure to use the same context so the UI works consistently with our other custom hooks
