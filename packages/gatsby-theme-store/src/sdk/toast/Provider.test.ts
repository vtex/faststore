import { renderHook, act } from '@testing-library/react-hooks'

import { Provider as ToastProvider } from './Provider'
import { useToast } from './useToast'

const sleep = ({ duration }: { duration: number }): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), duration)
  })

test('Toast Provider: Show Toast default properties', async () => {
  const { result } = renderHook(() => useToast(), { wrapper: ToastProvider })

  const contentWithoutID = 'My Content without ID'

  act(() => {
    result.current.showToast({ content: contentWithoutID })
  })

  expect(result.current.messages).toHaveLength(1)

  const [messageWihtoutID] = result.current.messages

  expect(messageWihtoutID.content).toBe(contentWithoutID)
  expect(messageWihtoutID.type).toBe('success')
  expect(messageWihtoutID.id).toBeDefined()

  // Wait the message be removed after default duration 3000
  await act(async () => sleep({ duration: 3000 }))

  expect(result.current.messages).toHaveLength(0)
})

test('Toast Provider: ShowToast with custom properties', async () => {
  const { result } = renderHook(() => useToast(), { wrapper: ToastProvider })

  const content = 'My content test'
  const type = 'error'
  const id = 'id'
  const duration = 200

  act(() => {
    result.current.showToast({ content, type, id, duration })
  })

  expect(result.current.messages).toHaveLength(1)

  const [message] = result.current.messages

  expect(message.id).toBe(id)
  expect(message.content).toBe(content)
  expect(message.type).toBe(type)

  // Wait message be hidden after 200 duration
  await act(async () => sleep({ duration }))

  expect(result.current.messages).toHaveLength(0)
})

test('Toast Provider: HideToast', () => {
  const { result } = renderHook(() => useToast(), { wrapper: ToastProvider })

  const content = 'My content test'
  const type = 'error'

  act(() => {
    result.current.showToast({ content, type, id: '1' })
    result.current.showToast({ content, type, id: '2' })
  })

  // Try to remove a message without wrong id. So none message will be removed
  act(() => {
    result.current.hideToast('WrongID')
  })

  expect(result.current.messages).toHaveLength(2)

  // Remove message with id 1
  act(() => {
    result.current.hideToast('1')
  })

  const [lastMessage] = result.current.messages

  expect(result.current.messages).toHaveLength(1)
  expect(lastMessage.id).toBe('2')

  // Remove message with id 2, the last one
  act(() => {
    result.current.hideToast('2')
  })

  expect(result.current.messages).toHaveLength(0)
})

test('Toast Provider: Multiple toasts', () => {
  const { result } = renderHook(() => useToast(), { wrapper: ToastProvider })

  const content = 'My content test'

  // Add 2 messages
  act(() => {
    result.current.showToast({ content })
    result.current.showToast({ content })
  })

  expect(result.current.messages).toHaveLength(2)

  // Add more 1 message
  act(() => {
    result.current.showToast({ content })
  })

  expect(result.current.messages).toHaveLength(3)

  // Remove 2 message
  act(() => {
    result.current.hideToast(result.current.messages[0].id)
    result.current.hideToast(result.current.messages[1].id)
  })

  expect(result.current.messages).toHaveLength(1)
})
