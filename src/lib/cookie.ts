export const saveCookie = (name: string, value: string, mins: number = 60) => {
  if (!name)
    throw new Error('Cookie name is required')

  const date = new Date()
  date.setTime(date.getTime() + mins * 60 * 1000)
  document.cookie = `${name}=${value};Expires=${date.toUTCString()}; path=/; Secure; SameSite=None`
}

export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=0; path=/; Secure; SameSite=None`
}
