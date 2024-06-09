export const saveCookie = (name: string, value: string, mins: number = 60) => {
  if (!name)
    throw new Error('Cookie name is required')

  const date = new Date()
  date.setTime(date.getTime() + mins * 60 * 1000)
  document.cookie =
    `${name}=${value};Expires=${date.toUTCString()}; \
    path=/; Secure; SameSite=Strict`
}

export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

export const clearAllCookies = () => {
  const cookies = document.cookie.split(";")
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i]
    const eqPos = cookie.indexOf("=")
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
}
