
import { saveCookie, getCookie, deleteCookie } from './cookie'

export const createStateCookie = (value: string) => {
  if (!value) throw new Error('state value is required')

  const state = crypto.randomUUID()
  saveCookie(`app.txs.${state}`, value, 30)

  return state
}

export const getStateCookie = (state: string) => {
  return getCookie(`app.txs.${state}`)
}

export const deleteStateCookie = (state: string) => {
  deleteCookie(`app.txs.${state}`)
}
