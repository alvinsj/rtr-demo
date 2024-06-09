
import { saveCookie, getCookie, deleteCookie } from '@lib/cookie'
import config from '@/config'

export const createStateCookie = (value: string) => {
  if (!value) throw new Error('state value is required')

  const state = crypto.randomUUID()
  saveCookie(`${config.STATE_COOKIE_PREFIX}${state}`, value, 30)

  return state
}

export const getStateCookie = (state: string) => {
  return getCookie(`${config.STATE_COOKIE_PREFIX}${state}`)
}

export const deleteStateCookie = (state: string) => {
  deleteCookie(`${config.STATE_COOKIE_PREFIX}${state}`)
}
