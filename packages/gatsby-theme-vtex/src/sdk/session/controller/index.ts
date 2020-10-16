import { Session } from '../types'

const items =
  'account.id,account.accountName,store.channel,store.countryCode,store.cultureInfo,store.currencyCode,store.currencySymbol,store.admin_cultureInfo,creditControl.creditAccounts,creditControl.deadlines,creditControl.minimumInstallmentValue,authentication.storeUserId,authentication.storeUserEmail,profile.firstName,profile.document,profile.email,profile.id,profile.isAuthenticated,profile.lastName,profile.phone,public.favoritePickup,public.utm_source,public.utm_medium,public.utm_campaign,public.utmi_cp,public.utmi_p,public.utmi_pc'

export const create = async () => {
  const params = new URLSearchParams(window.location.search)

  params.append('items', items)

  const response = await fetch(`/api/sessions?${params.toString()}`, {
    method: 'POST',
    credentials: 'same-origin',
    body: '{}',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  })

  return response.json() as Promise<Session>
}

export const clear = async () => {
  const response = await fetch('/api/sessions/invalidToken?items=*', {
    credentials: 'same-origin',
    headers: {
      'content-type': 'application/json',
    },
  })

  return response.json()
}

export const patch = async (data: any = {}) => {
  const response = await fetch(`/api/sessions?${window.location.search}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    credentials: 'same-origin',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  })

  return response.json()
}
