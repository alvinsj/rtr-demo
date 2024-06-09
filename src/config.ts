const BASE_URL = import.meta.env.VITE_BASE_URL
const LOGIN_URL = import.meta.env.VITE_AUTH_URL
const TOKEN_URL = import.meta.env.VITE_TOKEN_URL

const STATE_COOKIE_PREFIX = "app.txs."

export default {
  BASE_URL,
  LOGIN_URL,
  TOKEN_URL,

  STATE_COOKIE_PREFIX
}
