import { describe, expect, it, vi } from 'vitest'

import { BadRequestError } from '../../../../../src/platforms/errors'
import { subscribeToNewsletter } from '../../../../../src/platforms/vtex/resolvers/subscribeToNewsletter'

const makeContext = () => ({
  clients: {
    commerce: {
      subscribeToNewsletter: vi.fn().mockResolvedValue({ Id: 'NL-1' }),
    },
  },
})

const subscribe = (ctx: ReturnType<typeof makeContext>, data: any) =>
  subscribeToNewsletter(null, { data }, ctx as any)

describe('subscribeToNewsletter', () => {
  it('normalizes the input and returns only the created id', async () => {
    const ctx = makeContext()

    const result = await subscribe(ctx, {
      name: '  Jane  ',
      email: '  Jane@Example.com ',
    })

    expect(ctx.clients.commerce.subscribeToNewsletter).toHaveBeenCalledWith({
      name: 'Jane',
      email: 'jane@example.com',
    })
    expect(result).toEqual({ id: 'NL-1' })
  })

  it('omits an empty name, as sent when the name input is hidden', async () => {
    const ctx = makeContext()

    await subscribe(ctx, { name: '', email: 'jane@example.com' })

    expect(ctx.clients.commerce.subscribeToNewsletter).toHaveBeenCalledWith({
      name: undefined,
      email: 'jane@example.com',
    })
  })

  it('forwards only name and email, ignoring any other field', async () => {
    const ctx = makeContext()

    await subscribe(ctx, {
      name: 'Jane',
      email: 'jane@example.com',
      id: 'existing-document',
    })

    expect(ctx.clients.commerce.subscribeToNewsletter).toHaveBeenCalledWith({
      name: 'Jane',
      email: 'jane@example.com',
    })
  })

  it.each([
    ['an empty email', ''],
    ['an email without domain', 'jane@'],
    ['an email without TLD', 'jane@example'],
    ['an email with spaces', 'jane doe@example.com'],
    ['an email longer than 254 characters', `${'a'.repeat(250)}@example.com`],
  ])('rejects %s', async (_, email) => {
    const ctx = makeContext()

    await expect(subscribe(ctx, { name: 'Jane', email })).rejects.toThrow(
      BadRequestError
    )
    expect(ctx.clients.commerce.subscribeToNewsletter).not.toHaveBeenCalled()
  })

  it('rejects a name longer than 100 characters', async () => {
    const ctx = makeContext()

    await expect(
      subscribe(ctx, { name: 'a'.repeat(101), email: 'jane@example.com' })
    ).rejects.toThrow(BadRequestError)
    expect(ctx.clients.commerce.subscribeToNewsletter).not.toHaveBeenCalled()
  })
})
