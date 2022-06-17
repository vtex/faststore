# UI Provider

This component should be used to control any UI side effects your UI may have. An example is having a global state for the minicart so we can open it when the user clicks on the buyButton.

Trying to predict all possible UI global states is impossible, so if you need custom global states, you can add custom actions and effects to the global state. For a more hands on example, please take a look at our unit tests for this module in `/tests/ui/Provider.test.tsx`
