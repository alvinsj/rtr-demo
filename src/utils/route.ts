export const clearSearchParams = () => {
  const url = new URL(window.location.href)
  url.search = ''
  window.history.replaceState({}, document.title, url.toString())
}

export const getSearchParams = () => {
  const params = new URLSearchParams(window.location.search)
  const state = params.get('state')
  const code = params.get('code')
  return { state, code }
}

export const redirect = (url: string) => {
  window.location.replace(url)
}
