/**
 * Client for SP, Intelligent search's analytics event API
 * More info at: https://www.notion.so/vtexhandbook/Event-API-Documentation-48eee26730cf4d7f80f8fd7262231f84
 */
import { fetchAPI } from '../fetch'
import type { Options, Context } from '../../'

const THIRTY_MINUTES_S = 30 * 60
const ONE_YEAR_S = 365 * 24 * 3600

const randomUUID = () => (Math.random() * 1e6).toFixed(0)

const timelapsed = (past: number) => (Date.now() - past) / 1e3

const createId = (expiresSecond: number) => {
  let payload = randomUUID()
  let createdAt = Date.now()

  return () => {
    if (timelapsed(createdAt) > expiresSecond) {
      payload = randomUUID()
      createdAt = Date.now()
    }

    return payload
  }
}

const user = {
  anonymous: createId(ONE_YEAR_S),
  session: createId(THIRTY_MINUTES_S),
}

export type SearchEvent = {
  type: 'search.query'
  text: string // 'zapatilha'
  misspelled: boolean
  match: number
  operator: 'and' | 'or'
  locale: string
  session?: string
  anonymous?: string
}

export const SP = ({ account }: Options, _: Context) => {
  const base = `https://sp.vtex.com/event-api/v1/${account}/event`

  const sendEvent = (options: SearchEvent) => {
    return fetchAPI(base, {
      method: 'POST',
      body: JSON.stringify({
        ...options,
        agent: '@faststore/api',
        anonymous: user.anonymous(), // 'zZlNhqz1vFJP6iPG5Oqtt'
        session: user.session(), // 'Om1TNluGvgmSgU5OOTvkkd'
      }),
      headers: {
        'content-type': 'application/json',
      },
    })
  }

  return {
    sendEvent,
  }
}
