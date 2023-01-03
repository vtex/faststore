import React, { PropsWithChildren } from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import type { FC } from 'react'

import { UIProvider, useGlobalUIState } from '../../src'
import type { UIActions, UIEffects, UIInitialState } from '../../src'

test('UI PRovider: Open/Close minicart', async () => {
  const { result } = renderHook(useGlobalUIState, { wrapper: UIProvider })

  expect(result.current.displayMinicart).toBe(false)

  act(() => {
    result.current.openMinicart()
  })

  expect(result.current.displayMinicart).toBe(true)

  act(() => {
    result.current.closeMinicart()
  })

  expect(result.current.displayMinicart).toBe(false)
})

test('UI PRovider: Extend UI context', async () => {
  const actions: UIActions = {
    OPEN_MODAL: (state) => ({ ...state, displayModal: true }),
    CLOSE_MODAL: (state) => ({ ...state, displayModal: false }),
  }

  const effects: UIEffects = (dispatch) => ({
    openModal: () => dispatch({ type: 'OPEN_MODAL' }),
    closeModal: () => dispatch({ type: 'CLOSE_MODAL' }),
  })

  const initialState: UIInitialState = {
    displayModal: false,
  }

  const CustomUIProvider: FC = ({ children }: PropsWithChildren<any>) => (
    <UIProvider actions={actions} effects={effects} initialState={initialState}>
      {children}
    </UIProvider>
  )

  const { result } = renderHook(useGlobalUIState, {
    wrapper: CustomUIProvider,
  })

  expect(result.current.displayModal).toBe(false)

  act(() => {
    result.current.openModal()
  })

  expect(result.current.displayModal).toBe(true)

  act(() => {
    result.current.closeModal()
  })

  expect(result.current.displayModal).toBe(false)
})

test('UI PRovider: Extend UI context with custom data', async () => {
  interface ToastState {
    message: string
    timeout: number
    type: 'warn' | 'error' | 'info'
  }

  const actions: UIActions = {
    OPEN_TOAST: (state, data) => ({
      ...state,
      displayToast: true,
      toastState: data,
    }),
    CLOSE_TOAST: (state) => ({
      ...state,
      displayToast: false,
    }),
  }

  const effects: UIEffects = (dispatch) => ({
    openToast: (toastState: ToastState) =>
      dispatch({ type: 'OPEN_TOAST', data: toastState }),
    closeToast: () => dispatch({ type: 'CLOSE_TOAST' }),
  })

  const initialState: UIInitialState = {
    displayToast: false,
    toastState: {
      message: '',
      timeout: 3000,
      type: 'info',
    },
  }

  const CustomUIProvider: FC = ({ children }: PropsWithChildren<any>) => (
    <UIProvider actions={actions} effects={effects} initialState={initialState}>
      {children}
    </UIProvider>
  )

  const { result } = renderHook(useGlobalUIState, {
    wrapper: CustomUIProvider,
  })

  expect(result.current.displayToast).toBe(false)

  act(() => {
    result.current.openToast({
      message: 'ToastText',
      timeout: 1e3,
      type: 'warn',
    })
  })

  expect(result.current.displayToast).toBe(true)
  expect(result.current.toastState).toBeDefined()
  expect(result.current.toastState).toEqual({
    message: 'ToastText',
    timeout: 1e3,
    type: 'warn',
  })

  act(() => {
    result.current.closeToast()
  })

  expect(result.current.displayToast).toBe(false)
})
