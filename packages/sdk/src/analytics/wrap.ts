export interface UnknownEvent {
  name: string
  params: unknown
}

export type WrappedAnalyticsEventParams<T extends UnknownEvent> = Omit<
  T,
  'name'
> & {
  // Sadly tsdx doesn't support typescript 4.x yet. We should change this type to this when it does:
  // name: `store:${T['name']}`
  name: string
}

export interface WrappedAnalyticsEvent<T extends UnknownEvent> {
  name: 'AnalyticsEvent'
  params: WrappedAnalyticsEventParams<T>
}

export const STORE_EVENT_PREFIX = 'store:'
export const ANALYTICS_EVENT_TYPE = 'AnalyticsEvent'

export const wrap = <T extends UnknownEvent>(
  event: T
): WrappedAnalyticsEvent<T> =>
  ({
    name: ANALYTICS_EVENT_TYPE,
    params: {
      ...event,
      name: `${STORE_EVENT_PREFIX}${event.name}`,
    },
  } as WrappedAnalyticsEvent<T>)

export const unwrap = <T extends UnknownEvent>(
  event: WrappedAnalyticsEvent<T>
): T => {
  return {
    ...event.params,
    name: event.params.name.slice(
      STORE_EVENT_PREFIX.length,
      event.params.name.length
    ),
  } as T
}
