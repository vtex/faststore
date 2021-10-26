import { getSchema } from '../src'

describe('Schema', () => {
  it('returns a valid graphql schema for vtex platform', async () => {
    const schema = await getSchema({
      platform: 'vtex',
      account: 'storecomponents',
      environment: 'vtexcommercestable',
      channel: '1',
    })

    expect(schema).not.toBeNull()
  })
})
